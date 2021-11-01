import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../config/variables';

export default class SpotifyService {
  private static readonly scopes: string[] = []; // TODO

  private spotifyApi: SpotifyWebApi;

  private tokenRefresher: any = null;

  constructor() {
    // Init Spotify API
    this.spotifyApi = new SpotifyWebApi(Config.spotify);
  }

  // Routes
  // Get the url to start the authorization
  getAuthorizationUrl = () => this.spotifyApi.createAuthorizeURL(SpotifyService.scopes, '')

  // Finish the authorization
  authorizationCodeGrant = async (code: string) => {
    const authRes = await this.spotifyApi.authorizationCodeGrant(code);

    if (authRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return false;
    }

    this.spotifyApi.setAccessToken(authRes.body.access_token);
    this.spotifyApi.setRefreshToken(authRes.body.refresh_token);

    // Setup access token refresher
    clearInterval(this.tokenRefresher);
    this.tokenRefresher = setInterval(() => {
      this.spotifyApi.refreshAccessToken()
        .then((data) => {
          this.spotifyApi.setAccessToken(data.body.access_token);
        })
        .catch((err) => {
          // TODO: Error handling
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }, authRes.body.expires_in * 1000 - 10000);

    return true;
  }

  searchTracks = async (query: string) => {
    const searchRes = await this.spotifyApi.search(query, ['track']);

    if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return [];
    }

    return searchRes.body.tracks;
  }
}
