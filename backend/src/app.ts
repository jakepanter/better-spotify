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

      const isAuthorized = await this.spotifyService.authorizationCodeGrant(code.toString());
      if (!isAuthorized) {
        return res.redirect(`${Config.general.frontend_url}?error`);
      }

      // eslint-disable-next-line no-console
      console.log('Authorized');

      return res.redirect(`${Config.general.frontend_url}`);
    });

    this.server.get('/api/spotify/access-token', async (req: Request, res: Response) => {
      const token = await this.spotifyService.getAccessToken();
      return res.json(token);
    });

    /**
     * Perform a user's search with a given query
     */
     this.server.get('/api/spotify/customsearch', async (req: Request, res: Response) => {
      const type = req.query?.type;
      const search = req.query?.search;
      if (type === undefined || type === '' || search=== undefined || search === '') return res.sendStatus(400);
      const result = await this.spotifyService.searchCustom(type.toString(), search.toString());
      return res.json(result);
    });

    this.server.get('/api/spotify/searchtracks', async (req: Request, res: Response) => {
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.searchTracks(query.toString());
      return res.json(tracks);
    });

    this.server.get('/api/spotify/search', async (req: Request, res: Response) => {
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.search(query.toString());
      return res.json(tracks);
    });
    /**

    /**
     * Get me
     */
    this.server.get('/api/spotify/me', async (req: Request, res: Response) => {
      const me = await this.spotifyService.getMe();
      return res.json(me);
    });

    /**
     * Get liked/saved songs of current user
     */
    this.server.get('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const limit: any = req.query?.limit ?? 50;
      const offset: any = req.query?.offset ?? 0;

      const tracks = await this.spotifyService.getMySavedTracks(limit, offset);
      return res.json(tracks);
    });

    this.server.get('/api/spotify/track/:trackId', async (req: Request, res: Response) => {
      const trackId = req.params.trackId as string;
      const track = await this.spotifyService.getTrack(trackId);
      return res.json(track);
    });

    this.server.get('/api/spotify/me/tracks/contains', async (req: Request, res: Response) => {
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.isSaved(trackIds);
      return res.json(data);
    });

    /**
     * Add multiple tracks to saved tracks
     * Accepts a list of track ids
     */
    this.server.get('/api/spotify/me/tracks/add', async (req: Request, res: Response) => {
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.addToSavedTracks(trackIds);
      return res.json(data);
    });

    /**
     * Remove multiple tracks from saved tracks
     * Accepts a list of track ids
     */
    this.server.get('/api/spotify/me/tracks/remove', async (req: Request, res: Response) => {
      const trackIds: string[] = (req.query.trackIds as string ?? '').split(',');
      const data = await this.spotifyService.removeFromSavedTracks(trackIds);
      return res.json(data);
    });

    this.server.get('/api/spotify/album/:albumId', async (req: Request, res: Response) => {
      const albumId = req.params.albumId as string;
      const album = await this.spotifyService.getAlbum(albumId);
      return res.json(album);
    });

    this.server.get('/api/spotify/album/:albumId/tracks', async (req: Request, res: Response) => {
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const albumId = req.params.albumId as string;

      const album = await this.spotifyService.getAlbumTracks(albumId, limit, offset);
      return res.json(album);
    });

    this.server.get('/api/spotify/collections/albums', async (req: Request, res: Response) => {
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const albums = await this.spotifyService.getMySavedAlbums(limit, offset);
      return res.json(albums);
    });

    this.server.get('/api/spotify/playlists', async (req: Request, res: Response) => {
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);

      const playlists = await this.spotifyService.getMyPlaylists(limit, offset);
      return res.json(playlists);
    });

    this.server.post('/api/spotify/playlists', async (req: Request, res: Response) => {
      const { playlistName, options } = req.body;
      const playlist = await this.spotifyService.createPlaylist(playlistName, options);
      return res.json(playlist);
    });

    this.server.get('/api/spotify/playlist/:playlistId', async (req: Request, res: Response) => {
      const playlistId = req.params.playlistId as string;
      // define what specific fields to get,
      // for example: tracks(total) will result in {tracks: { total: x }}
      const fields = String(req.query?.fields ?? '');
      const playlist = await this.spotifyService.getPlaylist(playlistId, fields);
      return res.json(playlist);
    });

    this.server.post('/api/spotify/playlist/:playlistId/add', async (req: Request, res: Response) => {
      const { playlistId } = req.params;
      const tracks = req.body;
      await this.spotifyService.addTracksToPlaylist(playlistId, tracks);
      return res.status(200);
    });

    this.server.get('/api/spotify/playlist/:playlistId/tracks', async (req: Request, res: Response) => {
      const limit = Number(req.query?.limit ?? 50);
      const offset = Number(req.query?.offset ?? 0);
      const playlistId = req.params.playlistId as string;
      const album = await this.spotifyService.getPlaylistTracks(playlistId, limit, offset);
      return res.json(album);
    });

    this.server.put('/api/spotify/volume', async (req: Request, res: Response) => {
      const volume: any = req.query?.volume ?? 100;
      const result = await this.spotifyService.setVolume(volume);
      return res.json(result);
    });

    // Player Routes
    this.server.get('/api/spotify/me/player/devices', async (req: Request, res: Response) => {
      const result = await this.spotifyService.getDevices();
      return res.json(result);
    });

    this.server.get('/api/spotify/me/player', async (req: Request, res: Response) => {
      const result = await this.spotifyService.getPlaybackState();
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/pause', async (req: Request, res: Response) => {
      const result = await this.spotifyService.pause();
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/play', async (req: Request, res: Response) => {
      const result = await this.spotifyService.play(req.body);
      return res.json(result);
    });

    this.server.post('/api/spotify/me/player/previous', async (req: Request, res: Response) => {
      const result = await this.spotifyService.previous();
      return res.json(result);
    });

    this.server.post('/api/spotify/me/player/next', async (req: Request, res: Response) => {
      const result = await this.spotifyService.next();
      return res.json(result);
    });

    this.server.delete('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const result = await this.spotifyService.removeTracks(JSON.parse(req.body));
      return res.json(result);
    });

    this.server.put('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const result = await this.spotifyService.saveTracks(JSON.parse(req.body));
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player/seek', async (req: Request, res: Response) => {
      const position: any = req.query?.position ?? 0;
      const result = await this.spotifyService.seek(position);
      return res.json(result);
    });

    this.server.put('/api/spotify/me/player', async (req: Request, res: Response) => {
      // eslint-disable-next-line camelcase
      const { device_ids, play } = req.body ?? null;
      const result = await this.spotifyService.setDevice(device_ids, { play });
      return res.json(result);
    });

    // Serve static frontend files
    this.server.get('*', (req: Request, res: Response) => res.sendFile(path.join(`${__dirname}/../../frontend/build`)));

    // Start
    this.server.listen(Config.general.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend started at http://localhost:${Config.general.port}`);
    });
  }
}
