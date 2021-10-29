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
        return res.redirect('http://localhost:3000?error');
      }

      // eslint-disable-next-line no-console
      console.log('Authorized');

      return res.redirect('http://localhost:3000');
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