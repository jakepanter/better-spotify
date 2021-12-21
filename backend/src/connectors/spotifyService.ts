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
  getAuthorizationUrl = () => this.spotifyApi.createAuthorizeURL(SpotifyService.scopes, '', true)

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

  getMe = async () => {
    const me = await this.spotifyApi.getMe();
    return me.body;
  }

  getTrack = async (id: string) => {
    const track = await this.spotifyApi.getTrack(id);
    return track.body;
  }

  getAlbum = async (id: string) => {
    const album = await this.spotifyApi.getAlbum(id);
    return album.body;
  }

  getAlbumTracks = async (id: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    const album = await this.spotifyApi.getAlbumTracks(id, options);
    return album.body;
  }

  getMySavedAlbums = async (limit: number, offset: number) => {
    const options: any = { limit, offset };
    const albums = await this.spotifyApi.getMySavedAlbums(options);
    return albums.body;
  }

  isSaved = async (trackIds: string[]) => {
    const data = await this.spotifyApi.containsMySavedTracks(trackIds);
    return data.body;
  }

  addToSavedTracks = async (trackIds: string[]) => {
    const data = await this.spotifyApi.addToMySavedTracks(trackIds);
    return data.body;
  };

  removeFromSavedTracks = async (trackIds: string[]) => {
    const data = await this.spotifyApi.removeFromMySavedTracks(trackIds);
    return data.body;
  };

  getMyPlaylists = async (limit: number, offset: number) => {
    const options: any = { limit, offset };
    const result = await this.spotifyApi.getUserPlaylists(options);
    return result.body;
  }

  addTracksToPlaylist = async (playlistId: string, tracks: string[]) => {
    // TODO: error handling
    await this.spotifyApi.addTracksToPlaylist(playlistId, tracks);
  }

  getPlaylist = async (playlistId: string, fields: string) => {
    const result = await this.spotifyApi.getPlaylist(playlistId, { fields });
    return result.body;
  }

  getPlaylistTracks = async (id: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    const album = await this.spotifyApi.getPlaylistTracks(id, options);
    return album.body;
  }

  setVolume = async (volume: number) => {
    const result = await this.spotifyApi.setVolume(volume);
    return result;
  }

  getAccessToken = async () => this.spotifyApi.getAccessToken();
}
