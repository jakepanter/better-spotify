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

    return {
      access_token: authRes.body.access_token,
      refresh_token: authRes.body.refresh_token,
      expires_in: authRes.body.expires_in,
    };
  }

  refreshToken = async (refreshToken: string) => {
    this.spotifyApi.setRefreshToken(refreshToken);
    return this.spotifyApi.refreshAccessToken();
  };

  searchCustom = async (type: string, search: string) => {
    let searchRes = null;

    if (type === 'tracks') {
      searchRes = await this.spotifyApi.searchTracks(search);
    } else if (type === 'albums') {
      searchRes = await this.spotifyApi.searchAlbums(search);
    } else if (type === 'artists') {
      searchRes = await this.spotifyApi.searchArtists(search);
    } else if (type === 'playlists') {
      searchRes = await this.spotifyApi.searchPlaylists(search);
    } else if (type === 'shows') {
      searchRes = await this.spotifyApi.searchShows(search);
    } else if (type === 'episodes') {
      searchRes = await this.spotifyApi.searchEpisodes(search);
    }
    if (searchRes == null) {
      // TODO: Error handling
      return [];
    }

    if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return [];
    }

    return searchRes.body;
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

  // search in every Category
  search = async (query: string) => {
    const searchRes = await this.spotifyApi.search(query, ['album', 'artist', 'playlist', 'track', 'show', 'episode']);

    if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return [];
    }

    return searchRes.body;
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

  getTracks = async (ids: string[]) => {
    const tracks = await this.spotifyApi.getTracks(ids);
    return tracks.body;
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

  createPlaylist = async (
    playlistName: string,
    options: { description?: string, collaborative: boolean, public: boolean },
  ) => {
    const result = await this.spotifyApi.createPlaylist(playlistName, options);
    return result.body;
  }

  setVolume = async (volume: number) => {
    const result = await this.spotifyApi.setVolume(volume);
    return result;
  }

  // only 'before' is specified because we want to display the recently played tracks from the current timestamp
  // we do not need the option 'after' in our case
  getMyRecentlyPlayedTracks = async (before:number, limit:number) => {
    const options: any = { limit, before };
    const result = await this.spotifyApi.getMyRecentlyPlayedTracks(options);
    return result.body;
  }

  getNewReleases = async (country: string, limit: number, offset:number) => {
    const options: any = { country, limit, offset };
    const result = await this.spotifyApi.getNewReleases(options);
    return result.body;
  }

  getMyTopArtists = async (limit: number, offset:number, time_range: string) => {
    const options: any = { limit, offset, time_range };
    const result = await this.spotifyApi.getMyTopArtists(options);
    return result.body;
  }

  getArtist = async (artistId: string) => {
    const result = await this.spotifyApi.getArtist(artistId);
    return result.body;
  }

  getArtistRelatedArtists = async (artistId: string) => {
    const result = await this.spotifyApi.getArtistRelatedArtists(artistId);
    return result.body;
  }

  getAccessToken = async () => this.spotifyApi.getAccessToken();

  getDevices = async () => this.spotifyApi.getMyDevices();

  getPlaybackState = async () => this.spotifyApi.getMyCurrentPlaybackState();

  pause = async () => this.spotifyApi.pause();

  play = async (options: PlayOptions) => this.spotifyApi.play(options);

  previous = async () => this.spotifyApi.skipToPrevious();

  next = async () => this.spotifyApi.skipToNext();

  removeTracks = async (trackIds: ReadonlyArray<string>) => {
    this.spotifyApi.removeFromMySavedTracks(trackIds);
  }

  saveTracks = async (trackIds: ReadonlyArray<string>) => {
    this.spotifyApi.addToMySavedTracks(trackIds);
  }

  seek = async (position: number) => this.spotifyApi.seek(position);

  setDevice = async (deviceIds: ReadonlyArray<string>, options: TransferPlaybackOptions) => {
    this.spotifyApi.transferMyPlayback(deviceIds, options);
  }
}
