import express, { Application, Request, Response } from 'express';
import cors from 'cors';
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
     * Get liked/saved songs of current user
     */
    this.server.get('/api/spotify/me/tracks', async (req: Request, res: Response) => {
      const limit: any = req.query?.limit ?? 50;
      const offset: any = req.query?.offset ?? 0;

      const tracks = await this.spotifyService.getMySavedTracks(limit, offset);
      return res.json(tracks);
    });

    this.server.get('/api/spotify/track/:trackId', async (req: Request, res: Response) => {
      const { trackId } = req.params;
      const track = await this.spotifyService.getTrack(trackId);
      return res.json(track);
    });

    this.server.get('/api/spotify/album/:albumId', async (req: Request, res: Response) => {
      const { albumId } = req.params;
      const album = await this.spotifyService.getAlbum(albumId);
      return res.json(album);
    });

    this.server.get('/api/spotify/collections/albums', async (req: Request, res: Response) => {
      const limit: any = req.query?.limit ?? 20;
      const offset: any = req.query?.offset ?? 0;

      const albums = await this.spotifyService.getMySavedAlbums(limit, offset);
      return res.json(albums);
    });

    this.server.get('/api/spotify/playlists', async (req: Request, res: Response) => {
      const playlists = await this.spotifyService.getMyPlaylists();
      return res.json(playlists);
    });

    this.server.get('/api/spotify/playlist/:playlistId', async (req: Request, res: Response) => {
      const { playlistId } = req.params;
      const playlist = await this.spotifyService.getPlaylist(playlistId);
      return res.json(playlist);
    });

    this.server.get('/api/spotify/player/recently-played', async (req: Request, res: Response) => {
      console.log('here2');
      //if
      //const after: any = req.query?.after ?? 1638401402000;
      const before: any = req.query?.before ?? Date.now();
      const limit: any = req.query?.limit ?? 20;
      const recentTracks = await this.spotifyService.getMyRecentlyPlayedTracks(limit, before);
      return res.json(recentTracks);
    });

    // DB
    // TODO

    // Start
    this.server.listen(Config.general.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend started at http://localhost:${Config.general.port}`);
    });
  }
}
