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

  getArtist = async (id: string) => {
    const track = await this.spotifyApi.getArtist(id);
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
    const res = await this.spotifyApi.addTracksToPlaylist(playlistId, tracks);
    return res.body;
  }

  removeTracksFromPlaylist = async (
    playlistId: string,
    tracks: ReadonlyArray<{uri: string, positions: number[]}>,
  ) => {
    const res = await this.spotifyApi.removeTracksFromPlaylist(playlistId, tracks);
    return res.body;
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
  
  getShows = async (showIds: string[]) => {
    const data = await this.spotifyApi.getShows(showIds);
    return data.body;
  }; 

  getShowEpisodes = async (showId: string, limit: number, offset: number) => {
    const options: any = { limit, offset };
    const result = await this.spotifyApi.getShowEpisodes(showId, options);
    return result.body;
  }

  getShow = async(showId: string) => {
    const result = await this.spotifyApi.getShow(showId);
    return result.body;
  }

  getEpisode = async(episodeId: string) => {
    const result = await this.spotifyApi.getEpisode(episodeId);
    return result.body;
  }

  unfollowPlaylist = async (playlistId: string) => {
    const res = await this.spotifyApi.unfollowPlaylist(playlistId);
    return res.body;
  }

  editPlaylistDetails = async (playlistId: string, options: Object) => {
    const res = await this.spotifyApi.changePlaylistDetails(playlistId, options);
    return res.body;
  }

  addPlaylistImage = async (playlistId: string, imgData: string) => {
    const res = await this.spotifyApi.uploadCustomPlaylistCoverImage(playlistId, imgData);
    return res.body;
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

  // only 'before' is specified because we want to display the
  // recently played tracks from the current timestamp
  // we do not need the option 'after' in our case
  getMyRecentlyPlayedTracks = async (before: number, limit: number) => {
    const options: any = { limit, before };
    const result = await this.spotifyApi.getMyRecentlyPlayedTracks(options);
    return result.body;
  }

  getNewReleases = async (country: string, limit: number, offset: number) => {
    const options: any = { country, limit, offset };
    const result = await this.spotifyApi.getNewReleases(options);
    return result.body;
  }

  getMyTopArtists = async (limit: number, offset: number, timeRange: string) => {
    const options: any = { limit, offset, time_range: timeRange };
    const result = await this.spotifyApi.getMyTopArtists(options);
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
