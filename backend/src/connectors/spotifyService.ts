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

  searchCustom = async (accessToken: string, type: string, search: string) => {
    this.spotifyApi.setAccessToken(accessToken);
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

    this.spotifyApi.resetAccessToken();

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

  searchTracks = async (accessToken: string, query: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const searchRes = await this.spotifyApi.search(query, ['track']);
    this.spotifyApi.resetAccessToken();
    if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return [];
    }

    return searchRes.body.tracks;
  }

  // search in every Category
  search = async (accessToken: string, query: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const searchRes = await this.spotifyApi.search(query, ['album', 'artist', 'playlist', 'track', 'show', 'episode']);
    this.spotifyApi.resetAccessToken();

    if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
      return [];
    }

    return searchRes.body;
  }

  getMySavedTracks = async (accessToken: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const tracks = await this.spotifyApi.getMySavedTracks(options);
    this.spotifyApi.resetAccessToken();

    return tracks.body;
  }

  getMe = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const me = await this.spotifyApi.getMe();
    this.spotifyApi.resetAccessToken();
    return me.body;
  }

  getTrack = async (accessToken: string, id: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const track = await this.spotifyApi.getTrack(id);
    this.spotifyApi.resetAccessToken();
    return track.body;
  }

  getTracks = async (accessToken: string, ids: string[]) => {
    this.spotifyApi.setAccessToken(accessToken);
    const tracks = await this.spotifyApi.getTracks(ids);
    this.spotifyApi.resetAccessToken();
    return tracks.body;
  }

  getAlbum = async (accessToken: string, id: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const album = await this.spotifyApi.getAlbum(id);
    this.spotifyApi.resetAccessToken();
    return album.body;
  }

  getAlbumTracks = async (accessToken: string, id: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const album = await this.spotifyApi.getAlbumTracks(id, options);
    this.spotifyApi.resetAccessToken();
    return album.body;
  }

  getMySavedAlbums = async (accessToken: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const albums = await this.spotifyApi.getMySavedAlbums(options);
    this.spotifyApi.resetAccessToken();
    return albums.body;
  }

  isSaved = async (accessToken: string, trackIds: string[]) => {
    this.spotifyApi.setAccessToken(accessToken);
    const data = await this.spotifyApi.containsMySavedTracks(trackIds);
    this.spotifyApi.resetAccessToken();
    return data.body;
  }

  addToSavedTracks = async (accessToken: string, trackIds: string[]) => {
    this.spotifyApi.setAccessToken(accessToken);
    const data = await this.spotifyApi.addToMySavedTracks(trackIds);
    this.spotifyApi.resetAccessToken();
    return data.body;
  };

  removeFromSavedTracks = async (accessToken: string, trackIds: string[]) => {
    this.spotifyApi.setAccessToken(accessToken);
    const data = await this.spotifyApi.removeFromMySavedTracks(trackIds);
    this.spotifyApi.resetAccessToken();
    return data.body;
  };

  getMyPlaylists = async (accessToken: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getUserPlaylists(options);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  addTracksToPlaylist = async (accessToken: string, playlistId: string, tracks: string[]) => {
    // TODO: error handling
    this.spotifyApi.setAccessToken(accessToken);
    await this.spotifyApi.addTracksToPlaylist(playlistId, tracks);
    this.spotifyApi.resetAccessToken();
  }

  getPlaylist = async (accessToken: string, playlistId: string, fields: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getPlaylist(playlistId, { fields });
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getPlaylistTracks = async (accessToken: string, id: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const album = await this.spotifyApi.getPlaylistTracks(id, options);
    this.spotifyApi.resetAccessToken();
    return album.body;
  }

  createPlaylist = async (accessToken: string,
    playlistName: string,
    options: { description?: string, collaborative: boolean, public: boolean }) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.createPlaylist(playlistName, options);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  setVolume = async (accessToken: string, volume: number) => {
    this.spotifyApi.setAccessToken(accessToken);
    await this.spotifyApi.setVolume(volume);
    this.spotifyApi.resetAccessToken();
    return true;
  }

  // only 'before' is specified because we want to display the recently played tracks from the current timestamp
  // we do not need the option 'after' in our case
  getMyRecentlyPlayedTracks = async (accessToken: string, before:number, limit:number) => {
    const options: any = { limit, before };
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getMyRecentlyPlayedTracks(options);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getNewReleases = async (accessToken: string, country: string, limit: number, offset:number) => {
    const options: any = { country, limit, offset };
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getNewReleases(options);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getMyTopArtists = async (accessToken: string, limit: number, offset:number, time_range: string) => {
    const options: any = { limit, offset, time_range };
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getMyTopArtists(options);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getArtist = async (accessToken: string, artistId: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getArtist(artistId);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getArtistRelatedArtists = async (accessToken: string, artistId: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getArtistRelatedArtists(artistId);
    this.spotifyApi.resetAccessToken();
    return result.body;
  }

  getDevices = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getMyDevices();
    this.spotifyApi.resetAccessToken();
    return result.body;
  };

  getPlaybackState = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    const result = await this.spotifyApi.getMyCurrentPlaybackState();
    this.spotifyApi.resetAccessToken();
    return result.body;
  };

  pause = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.pause();
    this.spotifyApi.resetAccessToken();
  };

  play = async (accessToken: string, options: PlayOptions) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.play(options);
    this.spotifyApi.resetAccessToken();
  };

  previous = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.skipToPrevious();
    this.spotifyApi.resetAccessToken();
  };

  next = async (accessToken: string) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.skipToNext();
    this.spotifyApi.resetAccessToken();
  };

  removeTracks = async (accessToken: string, trackIds: ReadonlyArray<string>) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.removeFromMySavedTracks(trackIds);
    this.spotifyApi.resetAccessToken();
  }

  saveTracks = async (accessToken: string, trackIds: ReadonlyArray<string>) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.addToMySavedTracks(trackIds);
    this.spotifyApi.resetAccessToken();
  }

  seek = async (accessToken: string, position: number) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.seek(position);
    this.spotifyApi.resetAccessToken();
  };

  setDevice = async (accessToken: string,
    deviceIds: ReadonlyArray<string>,
    options: TransferPlaybackOptions) => {
    this.spotifyApi.setAccessToken(accessToken);
    this.spotifyApi.transferMyPlayback(deviceIds, options);
    this.spotifyApi.resetAccessToken();
  }
}
