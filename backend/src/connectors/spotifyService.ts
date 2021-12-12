import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../config/variables';

export default class SpotifyService {
  private static readonly scopes: string[] = [
    'ugc-image-upload',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-read-collaborative',
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-library-modify',
    'user-library-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-top-read',
    'app-remote-control',
    'streaming',
    'user-follow-modify',
    'user-follow-read',
  ]; // TODO

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

  getMySavedTracks = async (limit: number, offset: number) => {
    const options: any = { limit, offset };
    const tracks = await this.spotifyApi.getMySavedTracks(options);

    return tracks.body;
  }

  getTrack = async (id: string) => {
    const track = await this.spotifyApi.getTrack(id);
    return track.body;
  }
  
  getAlbum = async (id: string) => {
    const album = await this.spotifyApi.getAlbum(id);
    return album.body;
  }

  getMySavedAlbums = async (limit: number, offset: number) => {
    const options: any = { limit, offset };
    const albums = await this.spotifyApi.getMySavedAlbums(options);
    return albums.body;
  }

  getMyPlaylists = async () => {
    const result = await this.spotifyApi.getUserPlaylists();
    return result.body;
  }

  getPlaylist = async (playlistId: string) => {
    const result = await this.spotifyApi.getPlaylist(playlistId);
    return result.body;
  }

  getMyRecentlyPlayedTracks = async (limit:number, before:number) => {
    const options: any = {limit, before};
    const result = await this.spotifyApi.getMyRecentlyPlayedTracks(options);
    return result.body;
  }

  getAccessToken = async () => this.spotifyApi.getAccessToken();
}
