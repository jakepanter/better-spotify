import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../config/variables';

interface DeviceOptions {
  // eslint-disable-next-line camelcase
  device_id?: string | undefined;
}

interface PlayOptions extends DeviceOptions {
  // eslint-disable-next-line camelcase
  context_uri?: string | undefined;
  uris?: ReadonlyArray<string> | undefined;
  offset?: { position: number } | { uri: string } | undefined;
  // eslint-disable-next-line camelcase
  position_ms?: number | undefined;
}

interface TransferPlaybackOptions {
  play?: boolean | undefined;
}

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

  getSavedShows = async () => {
    const result = await this.spotifyApi.getMySavedShows();
    return result.body;
  }

  getShowEpisodes = async (id: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    const result = await this.spotifyApi.getShowEpisodes(id, options);
    return result.body;
  }

  getShow = async(showId: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    const result = await this.spotifyApi.getShow(showId, options);
    return result.body;
  }

  getEpisode = async(episodeId: string) => {
    const result = await this.spotifyApi.getEpisode(episodeId);
    return result.body;
  }

  setVolume = async (volume: number) => this.spotifyApi.setVolume(volume);

  getAccessToken = async () => this.spotifyApi.getAccessToken();

  getDevices = async () => this.spotifyApi.getMyDevices();

  getPlaybackState = async () => this.spotifyApi.getMyCurrentPlaybackState();

  pause = async () => this.spotifyApi.pause();

  play = async (options: PlayOptions) => this.spotifyApi.play(options);

  previous = async () => this.spotifyApi.skipToPrevious();

  next = async () => this.spotifyApi.skipToNext();

  removeTracks = async (trackIds: ReadonlyArray<string>) => this.spotifyApi.removeFromMySavedTracks(trackIds);

  saveTracks = async (trackIds: ReadonlyArray<string>) => this.spotifyApi.addToMySavedTracks(trackIds);

  seek = async (position: number) => this.spotifyApi.seek(position);

  setDevice = async (deviceIds: ReadonlyArray<string>, options: TransferPlaybackOptions) => this.spotifyApi.transferMyPlayback(deviceIds, options);
}
