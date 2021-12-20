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
    this.server.use(express.static(path.join(__dirname, '../frontend/build')));

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
    this.server.get('/api/spotify/search', async (req: Request, res: Response) => {
      const { query } = req.query;
      if (query === undefined || query === '') return res.sendStatus(400);
      const tracks = await this.spotifyService.searchTracks(query.toString());
      return res.json(tracks);
    });

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

    this.server.get('/api/spotify/volume', async (req: Request, res: Response) => {
      const volume: any = req.query?.volume ?? 100;
      const result = await this.spotifyService.setVolume(volume);
      return res.json(result);
    });

    this.server.get('*', (req: Request, res: Response) => res.sendFile(path.join(`${__dirname}/../../frontend/build/index.html`)));

    // DB
    // TODO

    // Start
    this.server.listen(Config.general.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend started at http://localhost:${Config.general.port}`);
    });
  }
}
