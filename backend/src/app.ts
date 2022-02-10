import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import SpotifyService from './connectors/spotifyService';
import Config from './config/variables';

type RepeatState = 'track' | 'context' | 'off';

export default class App {
  private spotifyService: SpotifyService;

  private server: Application;

  constructor() {
    this.spotifyService = new SpotifyService();
    const getToken = (req: Request) => req.headers.authorization?.split(' ')[1] as string;

    // Init express server
    this.server = express();
    this.server.use(cors());
    this.server.use(bodyParser.json({ limit: '1MB' }));
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(express.static(path.join(__dirname, '../../frontend/build')));

    // Routes
    // Spotify authentication
    this.server.get('/api/spotify/get-auth-url', (req: Request, res: Response) => {
      const url = this.spotifyService.getAuthorizationUrl();
      return res.send(url);
    });

    this.server.get('/api/spotify/authorization-code-grant', async (req: Request, res: Response) => {
      const { code } = req.query;
      if (code === undefined) return res.sendStatus(400);

      const authorization = await this.spotifyService.authorizationCodeGrant(code.toString());
      if (!authorization) {
        return res.redirect(`${Config.general.frontend_url}?error`);
      }

      // eslint-disable-next-line no-console
      console.log('Authorized');

      return res.redirect(`${Config.general.frontend_url}?access_token=${authorization.access_token}&refresh_token=${authorization.refresh_token}&expires_in=${authorization.expires_in}`);
    });

    this.server.get('/api/spotify/refresh-token', async (req: Request, res: Response) => {
      const refreshToken = getToken(req);
      const authRes = await this.spotifyService.refreshToken(refreshToken);

      if (authRes === null) return res.sendStatus(500);
      return res.json(authRes);
    });

    /**
     * Perform a user's search with a given query
     */
    this.server.get('/api/spotify/customsearch', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const type = req.query?.type;
      const search = req.query?.search;
      if (type === undefined || type === '' || search === undefined || search === '') return res.sendStatus(400);
      const result = await this.spotifyService.searchCustom(
        accessToken,
        type.toString(),
        search.toString(),
      );

      if (result === null) return res.sendStatus(500);
      return res.json(result);
    });

    this.server.get('/api/spotify/searchtracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.searchTracks(accessToken, query.toString());

      if (tracks === null) return res.sendStatus(500);
      return res.json(tracks);
    });

    this.server.get('/api/spotify/search', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.search(accessToken, query.toString());

      if (tracks === null) return res.sendStatus(500);
      return res.json(tracks);
    });
    /**

     /**
     * Get me
     */
    this.server.get('/api/spotify/me', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const me = await this.spotifyService.getMe(accessToken);

      if (me === null) return res.sendStatus(500);
      return res.json(me);
    });

    /**
     * Get liked/saved songs of current user
     */
    this.server.get('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit: any = req.query?.limit ?? 50;
      const offset: any = req.query?.offset ?? 0;

      const tracks = await this.spotifyService.getMySavedTracks(accessToken, limit, offset);

      if (tracks === null) return res.sendStatus(500);
      return res.json(tracks);
    });

    this.server.get('/api/spotify/track/:trackId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackId = req.params.trackId as string;
      const track = await this.spotifyService.getTrack(accessToken, trackId);

      if (track === null) return res.sendStatus(500);
      return res.json(track);
    });

    this.server.get('/api/spotify/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.getTracks(accessToken, trackIds);

      if (data === null) return res.sendStatus(500);
      return res.json(data);
    });

    this.server.get('/api/spotify/me/tracks/contains', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      if (trackIds.length === 1 && trackIds[0] === '') return res.json([]);
      const data = await this.spotifyService.isSaved(accessToken, trackIds);

      if (data === null) return res.sendStatus(500);
      return res.json(data);
    });

    /**
     * Add multiple tracks to saved tracks
     * Accepts a list of track ids
     */
    this.server.get('/api/spotify/me/tracks/add', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.addToSavedTracks(accessToken, trackIds);

      if (data === null) return res.sendStatus(500);
      return res.json(data);
    });

    /**
     * Remove multiple tracks from saved tracks
     * Accepts a list of track ids
     */
    this.server.get('/api/spotify/me/tracks/remove', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.removeFromSavedTracks(accessToken, trackIds);

      if (data === null) return res.sendStatus(500);
      return res.json(data);
    });

    this.server.get('/api/spotify/album/:albumId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const albumId = req.params.albumId as string;
      const album = await this.spotifyService.getAlbum(accessToken, albumId);

      if (album === null) return res.sendStatus(500);
      return res.json(album);
    });

    this.server.get('/api/spotify/album/:albumId/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const albumId = req.params.albumId as string;

      const album = await this.spotifyService.getAlbumTracks(accessToken, albumId, limit, offset);

      if (album === null) return res.sendStatus(500);
      return res.json(album);
    });

    this.server.get('/api/spotify/collections/albums', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const albums = await this.spotifyService.getMySavedAlbums(accessToken, limit, offset);

      if (albums === null) return res.sendStatus(500);
      return res.json(albums);
    });

    this.server.get('/api/spotify/me/albums/contains', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const albumIds: string[] = (req.query.albumIds as string ?? '').split(',');
      if (albumIds.length === 1 && albumIds[0] === '') return res.json([]);
      const data = await this.spotifyService.isAlbumSaved(accessToken, albumIds);
      return res.json(data);
    });

    this.server.get('/api/spotify/me/albums/add', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const albumIds: string[] = (req.query.albumIds as string ?? '').split(',');
      const data = await this.spotifyService.addToSavedAlbums(accessToken, albumIds);
      return res.json(data);
    });

    this.server.get('/api/spotify/me/albums/remove', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const albumIds: string[] = (req.query.albumIds as string ?? '').split(',');
      const data = await this.spotifyService.removeFromSavedAlbums(accessToken, albumIds);
      return res.json(data);
    });

    this.server.get('/api/spotify/playlists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const playlists = await this.spotifyService.getMyPlaylists(accessToken, limit, offset);

      if (playlists === null) return res.sendStatus(500);
      return res.json(playlists);
    });

    this.server.post('/api/spotify/playlists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { playlistName, options } = req.body;
      const playlist = await this.spotifyService.createPlaylist(accessToken, playlistName, options);

      if (playlist === null) return res.sendStatus(500);
      return res.json(playlist);
    });

    this.server.get('/api/spotify/playlist/:playlistId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      // define what specific fields to get,
      // for example: tracks(total) will result in {tracks: { total: x }}
      const fields = String(req.query?.fields ?? '');
      const playlist = await this.spotifyService.getPlaylist(accessToken, playlistId, fields);

      if (playlist === null) return res.sendStatus(500);
      return res.json(playlist);
    });

    this.server.post('/api/spotify/playlist/:playlistId/add', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { playlistId } = req.params;
      const tracks = req.body;
      const response = await this.spotifyService.addTracksToPlaylist(
        accessToken,
        playlistId,
        tracks,
      );

      if (response === null) return res.sendStatus(500);
      return res.json(response);
    });

    this.server.post('/api/spotify/playlist/:playlistId/remove', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { playlistId } = req.params;
      const tracks = req.body;
      const response = await this.spotifyService.removeTracksFromPlaylist(
        accessToken,
        playlistId,
        tracks,
      );

      if (response === null) return res.sendStatus(500);
      return res.json(response);
    });

    // fetch artist
    this.server.get('/api/spotify/artist/:artistId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId: string = req.params.artistId as string;
      const artists = await this.spotifyService.getArtist(accessToken, artistId);

      if (artists === null) return res.sendStatus(500);
      return res.json(artists);
    });

    this.server.get('/api/spotify/artist/:artistId/albums', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId = req.params.artistId as string;
      const includeGroups = req.query?.include_groups as string ?? undefined;
      const limit = Number(req.query?.limit ?? 20);
      const market = req.query?.market as string ?? 'DE';
      const offset = Number(req.query?.offset ?? 0);
      const albums = await this.spotifyService.getArtistAlbums(
        accessToken, artistId, limit, market, offset, includeGroups,
      );

      if (albums === null) return res.sendStatus(500);
      return res.json(albums);
    });

    this.server.get('/api/spotify/artist/:artistId/top-tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId = req.params.artistId as string;
      const country = req.query?.country as string ?? 'DE';
      const topTracks = await this.spotifyService.getArtistTopTracks(
        accessToken, artistId, country,
      );

      if (topTracks === null) return res.sendStatus(500);
      return res.json(topTracks);
    });

    this.server.get('/api/spotify/playlist/:playlistId/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const playlistId = req.params.playlistId as string;
      const album = await this.spotifyService.getPlaylistTracks(
        accessToken,
        playlistId,
        limit,
        offset,
      );

      if (album === null) return res.sendStatus(500);
      return res.json(album);
    });

    this.server.get('/api/spotify/playlist/:playlistId/unfollow', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      const response = await this.spotifyService.unfollowPlaylist(accessToken, playlistId);

      if (response === null) return res.sendStatus(500);
      return res.json(response);
    });

    this.server.post('/api/spotify/playlist/:playlistId/edit', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      const options = req.body;
      const response = await this.spotifyService.editPlaylistDetails(
        accessToken,
        playlistId,
        options,
      );

      if (response === null) return res.sendStatus(500);
      return res.json(response);
    });

    this.server.post('/api/spotify/playlist/:playlistId/image', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      const imgData = req.body.image;
      const response = await this.spotifyService.addPlaylistImage(accessToken, playlistId, imgData);

      if (response === null) return res.sendStatus(500);
      return res.json(response);
    });

    this.server.get('/api/spotify/me/shows', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const shows = await this.spotifyService.getSavedShows(accessToken);

      if (shows === null) return res.sendStatus(500);
      return res.json(shows);
    });

    this.server.get('/api/spotify/shows', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const showIds: string[] = (req.query.showIds as string ?? ' ').split(',');
      const shows = await this.spotifyService.getShows(accessToken, showIds);

      if (shows === null) return res.sendStatus(500);
      return res.json(shows);
    });

    this.server.get('/api/spotify/show/:showId/episodes', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const showId = req.params.showId as string;

      const episodes = await this.spotifyService.getShowEpisodes(
        accessToken,
        showId,
        limit,
        offset,
      );

      if (episodes === null) return res.sendStatus(500);
      return res.json(episodes);
    });

    this.server.get('/api/spotify/show/:showId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const showId = req.params.showId as string;
      const show = await this.spotifyService.getShow(accessToken, showId);

      if (show === null) return res.sendStatus(500);
      return res.json(show);
    });

    this.server.get('/api/spotify/episode/:episodeId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { episodeId } = req.params;
      const episode = await this.spotifyService.getEpisode(accessToken, episodeId);

      if (episode === null) return res.sendStatus(500);
      return res.json(episode);
    });

    this.server.put('/api/spotify/volume', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const volume: any = req.query?.volume ?? 100;
      const result = await this.spotifyService.setVolume(accessToken, volume);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    // Player Routes
    this.server.get('/api/spotify/me/player/devices', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.getDevices(accessToken);

      if (result === null) return res.sendStatus(500);
      return res.json(result);
    });

    this.server.get('/api/spotify/me/player', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.getPlaybackState(accessToken);

      if (result === null) return res.sendStatus(500);
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/pause', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.pause(accessToken);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.put('/api/spotify/me/player/play', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const status = await this.spotifyService.play(accessToken, req.body);

      if (status === null) return res.sendStatus(500);
      return res.sendStatus(status);
    });

    this.server.post('/api/spotify/me/player/previous', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.previous(accessToken);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.post('/api/spotify/me/player/next', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.next(accessToken);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.delete('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.removeTracks(accessToken, JSON.parse(req.body));

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.put('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.saveTracks(accessToken, JSON.parse(req.body));

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.put('/api/spotify/me/player/seek', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const position: any = req.query?.position ?? 0;
      const result = await this.spotifyService.seek(accessToken, position);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.put('/api/spotify/me/player', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      // eslint-disable-next-line camelcase
      const { device_ids, play } = req.body ?? null;
      const result = await this.spotifyService.setDevice(accessToken, device_ids, { play });

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.get('/api/spotify/player/recently-played', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      // only 'before' is specified because we want to display
      // the recently played tracks from the current timestamp
      const before: any = req.query?.before ?? Date.now();
      const limit: any = req.query?.limit ?? 20;
      const recentTracks = await this.spotifyService.getMyRecentlyPlayedTracks(
        accessToken,
        before,
        limit,
      );

      if (recentTracks === null) return res.sendStatus(500);
      return res.json(recentTracks);
    });

    this.server.get('/api/spotify/browse/new-releases', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const country: any = req.query?.country as string ?? undefined;
      const limit: any = Number(req.query?.limit ?? 20);
      const offset: any = Number(req.query?.offset ?? 0);
      const newRealeses = await this.spotifyService.getNewReleases(
        accessToken,
        country,
        limit,
        offset,
      );

      if (newRealeses === null) return res.sendStatus(500);
      return res.json(newRealeses);
    });

    this.server.get('/api/spotify/me/top/artists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit: number = Number(req.query?.limit ?? 20);
      const offset: number = Number(req.query?.offset ?? 0);
      const timeRange: string = req.query?.time_range as string ?? 'medium_term';
      const topArtists = await this.spotifyService.getMyTopArtists(
        accessToken,
        limit,
        offset,
        timeRange,
      );

      if (topArtists === null) return res.sendStatus(500);
      return res.json(topArtists);
    });

    this.server.get('/api/spotify/artists/:artistId/related-artists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId: string = req.params.artistId as string;
      const artists = await this.spotifyService.getArtistRelatedArtists(accessToken, artistId);

      if (artists === null) return res.sendStatus(500);
      return res.json(artists);
    });

    this.server.put('/api/spotify/me/player/shuffle', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const state: boolean = JSON.parse(req.query?.state as string);
      const result = await this.spotifyService.setShuffle(accessToken, state);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    this.server.put('/api/spotify/me/player/repeat', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const state: RepeatState = req.query?.state as RepeatState;
      const result = await this.spotifyService.setRepeat(accessToken, state);

      if (result === null) return res.sendStatus(500);
      return res.sendStatus(200);
    });

    // This must be before this.server.listen(...)
    // Serve static frontend files
    this.server.get('*', (req: Request, res: Response) => res.sendFile(path.join(`${__dirname}/../../frontend/build`)));

    // Start
    this.server.listen(Config.general.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend started at http://localhost:${Config.general.port}`);
    });
  }
}
