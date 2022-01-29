import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import SpotifyService from './connectors/spotifyService';
import Config from './config/variables';

export default class App {
  private spotifyService: SpotifyService;

  private server: Application;

  constructor() {
    this.spotifyService = new SpotifyService();
    const getToken = (req: Request) => req.headers.authorization?.split(' ')[1] as string;

    // Init express server
    this.server = express();
    this.server.use(cors());
    this.server.use(bodyParser.json());
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
      return res.json(result);
    });

    this.server.get('/api/spotify/searchtracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.searchTracks(accessToken, query.toString());
      return res.json(tracks);
    });

    this.server.get('/api/spotify/search', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.search(accessToken, query.toString());
      return res.json(tracks);
    });
    /**

     /**
     * Get me
     */
    this.server.get('/api/spotify/me', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const me = await this.spotifyService.getMe(accessToken);
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
      return res.json(tracks);
    });

    this.server.get('/api/spotify/track/:trackId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackId = req.params.trackId as string;
      const track = await this.spotifyService.getTrack(accessToken, trackId);
      return res.json(track);
    });

    this.server.get('/api/spotify/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.getTracks(accessToken, trackIds);
      return res.json(data);
    });

    this.server.get('/api/spotify/me/tracks/contains', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      if (trackIds.length === 1 && trackIds[0] === '') return res.json([]);
      const data = await this.spotifyService.isSaved(accessToken, trackIds);
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
      return res.json(data);
    });

    this.server.get('/api/spotify/album/:albumId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const albumId = req.params.albumId as string;
      const album = await this.spotifyService.getAlbum(accessToken, albumId);
      return res.json(album);
    });

    this.server.get('/api/spotify/album/:albumId/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const albumId = req.params.albumId as string;

      const album = await this.spotifyService.getAlbumTracks(accessToken, albumId, limit, offset);
      return res.json(album);
    });

    this.server.get('/api/spotify/collections/albums', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const albums = await this.spotifyService.getMySavedAlbums(accessToken, limit, offset);
      return res.json(albums);
    });

    this.server.get('/api/spotify/playlists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const playlists = await this.spotifyService.getMyPlaylists(accessToken, limit, offset);
      return res.json(playlists);
    });

    this.server.post('/api/spotify/playlists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { playlistName, options } = req.body;
      const playlist = await this.spotifyService.createPlaylist(accessToken, playlistName, options);
      return res.json(playlist);
    });

    this.server.get('/api/spotify/playlist/:playlistId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      // define what specific fields to get,
      // for example: tracks(total) will result in {tracks: { total: x }}
      const fields = String(req.query?.fields ?? '');
      const playlist = await this.spotifyService.getPlaylist(accessToken, playlistId, fields);
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
      return res.json(response);
    });


    // fetch artist
    this.server.get('/api/spotify/artist/:artistId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId: string = req.params.artistId as string;
      const artists = await this.spotifyService.getArtist(accessToken, artistId);
      return res.json(artists);
    });

    this.server.get('/api/spotify/artist/:artistId/albums', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId = req.params.artistId as string;
      const include_groups = req.query?.include_groups as string ?? undefined;
      const limit = Number(req.query?.limit ?? 20);
      const market = req.query?.market as string ?? "DE";
      const offset = Number(req.query?.offset ?? 0);
      const albums = await this.spotifyService.getArtistAlbums(accessToken, artistId, limit, market, offset, include_groups);
      return res.json(albums);
    });

    this.server.get('/api/spotify/artist/:artistId/top-tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId = req.params.artistId as string;
      const country = req.query?.country as string ?? "DE";
      const topTracks = await this.spotifyService.getArtistTopTracks(accessToken, artistId, country);
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
      return res.json(album);
    });

    this.server.get('/api/spotify/playlist/:playlistId/unfollow', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      const response = await this.spotifyService.unfollowPlaylist(accessToken, playlistId);
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
      return res.json(response);
    });

    this.server.post('/api/spotify/playlist/:playlistId/image', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const playlistId = req.params.playlistId as string;
      const imgData = req.body.image;
      const response = await this.spotifyService.addPlaylistImage(accessToken, playlistId, imgData);
      return res.json(response);
    });

    this.server.get('/api/spotify/me/shows', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const shows = await this.spotifyService.getSavedShows(accessToken);
      return res.json(shows);
    });

    this.server.get('/api/spotify/shows', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const showIds: string[] = (req.query.showIds as string ?? ' ').split(',');
      const shows = await this.spotifyService.getShows(accessToken, showIds);
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
      return res.json(episodes);
    });

    this.server.get('/api/spotify/show/:showId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const showId = req.params.showId as string;
      const show = await this.spotifyService.getShow(accessToken, showId);
      return res.json(show);
    });

    this.server.get('/api/spotify/episode/:episodeId', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const { episodeId } = req.params;
      const episode = await this.spotifyService.getEpisode(accessToken, episodeId);
      return res.json(episode);
    });

    this.server.put('/api/spotify/volume', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const volume: any = req.query?.volume ?? 100;
      const result = await this.spotifyService.setVolume(accessToken, volume);
      return res.json(result);
    });

    // Player Routes
    this.server.get('/api/spotify/me/player/devices', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.getDevices(accessToken);
      return res.json(result);
    });

    this.server.get('/api/spotify/me/player', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.getPlaybackState(accessToken);
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/pause', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.pause(accessToken);
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/play', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.play(accessToken, req.body);
      return res.json(result);
    });

    this.server.post('/api/spotify/me/player/previous', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.previous(accessToken);
      return res.json(result);
    });

    this.server.post('/api/spotify/me/player/next', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.next(accessToken);
      return res.json(result);
    });

    this.server.delete('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.removeTracks(accessToken, JSON.parse(req.body));
      return res.json(result);
    });

    this.server.put('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.saveTracks(accessToken, JSON.parse(req.body));
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/seek', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const position: any = req.query?.position ?? 0;
      const result = await this.spotifyService.seek(accessToken, position);
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      // eslint-disable-next-line camelcase
      const { device_ids, play } = req.body ?? null;
      const result = await this.spotifyService.setDevice(accessToken, device_ids, { play });
      return res.json(result);
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
      return res.json(newRealeses);
    });

    this.server.get('/api/spotify/me/top/artists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const limit: number = Number(req.query?.limit ?? 20);
      const offset: number = Number(req.query?.offset ?? 0);
      const time_range: string = req.query?.time_range as string ?? 'medium_term';
      const topArtists = await this.spotifyService.getMyTopArtists(
          accessToken,
          limit,
          offset,
          time_range,
      );
      return res.json(topArtists);
    });


    this.server.get('/api/spotify/artists/:artistId/related-artists', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const artistId: string = req.params.artistId as string;
      const artists = await this.spotifyService.getArtistRelatedArtists(accessToken, artistId);
      return res.json(artists);
    });

    this.server.put('/api/spotify/me/player/play', async (req: Request, res: Response) => {
      const accessToken = getToken(req);
      const result = await this.spotifyService.play(accessToken, req.body);
      return res.json(result);
    });

    // get current song
    this.server.get('/api/spotify/player/currently-playing', async (req: Request, res: Response) => {
      const currentlyPlaying = await this.spotifyService.getPlaybackState();
      return res.json(currentlyPlaying);
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
