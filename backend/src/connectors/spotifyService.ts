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

type RepeatState = 'track' | 'context' | 'off';

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
    'streaming',
    // Currently we do not use these 3:
    // 'app-remote-control',
    // 'user-follow-modify',
    // 'user-follow-read',
  ];

  private spotifyApi: SpotifyWebApi;

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

    return {
      access_token: authRes.body.access_token,
      refresh_token: authRes.body.refresh_token,
      expires_in: authRes.body.expires_in,
    };
  }

  refreshToken = async (refreshToken: string) => {
    try {
      this.spotifyApi.setRefreshToken(refreshToken);
      return this.spotifyApi.refreshAccessToken();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  searchCustom = async (accessToken: string, type: string, search: string) => {
    try {
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

      if (searchRes === null) {
      // TODO: Error handling
        return [];
      }

      if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
        return [];
      }

      return searchRes.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  searchTracks = async (accessToken: string, query: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const searchRes = await this.spotifyApi.search(query, ['track']);
      this.spotifyApi.resetAccessToken();
      return searchRes.body.tracks;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // search in every Category
  search = async (accessToken: string, query: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const searchRes = await this.spotifyApi.search(query, ['album', 'artist', 'playlist', 'track', 'show', 'episode']);
      this.spotifyApi.resetAccessToken();

      if (searchRes.statusCode !== 200) {
      // Authorization did not work
      // TODO: Error handling
        return [];
      }

      return searchRes.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getMySavedTracks = async (accessToken: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const tracks = await this.spotifyApi.getMySavedTracks(options);
      this.spotifyApi.resetAccessToken();

      return tracks.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getMe = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const me = await this.spotifyApi.getMe();
      this.spotifyApi.resetAccessToken();
      return me.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getTrack = async (accessToken: string, id: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const track = await this.spotifyApi.getTrack(id);
      this.spotifyApi.resetAccessToken();
      return track.body;
    } catch (e) {
      console.log('track failed');
      return null;
    }
  }

  getTracks = async (accessToken: string, ids: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const tracks = await this.spotifyApi.getTracks(ids);
      this.spotifyApi.resetAccessToken();
      return tracks.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getAlbum = async (accessToken: string, id: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const album = await this.spotifyApi.getAlbum(id);
      this.spotifyApi.resetAccessToken();
      return album.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getAlbumTracks = async (accessToken: string, id: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const album = await this.spotifyApi.getAlbumTracks(id, options);
      this.spotifyApi.resetAccessToken();
      return album.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getMySavedAlbums = async (accessToken: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const albums = await this.spotifyApi.getMySavedAlbums(options);
      this.spotifyApi.resetAccessToken();
      return albums.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  isSaved = async (accessToken: string, trackIds: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const data = await this.spotifyApi.containsMySavedTracks(trackIds);
      this.spotifyApi.resetAccessToken();
      return data.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  addToSavedTracks = async (accessToken: string, trackIds: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const data = await this.spotifyApi.addToMySavedTracks(trackIds);
      this.spotifyApi.resetAccessToken();
      return data.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  removeFromSavedTracks = async (accessToken: string, trackIds: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const data = await this.spotifyApi.removeFromMySavedTracks(trackIds);
      this.spotifyApi.resetAccessToken();
      return data.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  getMyPlaylists = async (accessToken: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getUserPlaylists(options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  addTracksToPlaylist = async (accessToken: string, playlistId: string, tracks: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const res = await this.spotifyApi.addTracksToPlaylist(playlistId, tracks);
      this.spotifyApi.resetAccessToken();
      return res.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  removeTracksFromPlaylist = async (
    accessToken: string,
    playlistId: string,
    tracks: ReadonlyArray<{uri: string, positions: number[]}>,
  ) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const res = await this.spotifyApi.removeTracksFromPlaylist(playlistId, tracks);
      this.spotifyApi.resetAccessToken();
      return res.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getPlaylist = async (accessToken: string, playlistId: string, fields: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getPlaylist(playlistId, { fields });
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getPlaylistTracks = async (accessToken: string, id: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const album = await this.spotifyApi.getPlaylistTracks(id, options);
      this.spotifyApi.resetAccessToken();
      return album.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getSavedShows = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getMySavedShows();
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getShows = async (accessToken: string, showIds: string[]) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const data = await this.spotifyApi.getShows(showIds);
      this.spotifyApi.resetAccessToken();
      return data.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  getShowEpisodes = async (accessToken: string, showId: string, limit: number, offset: number) => {
    try {
      const options: any = { limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getShowEpisodes(showId, options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getShow = async (accessToken: string, showId: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getShow(showId);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getEpisode = async (accessToken: string, episodeId: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getEpisode(episodeId);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  unfollowPlaylist = async (accessToken: string, playlistId: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const res = await this.spotifyApi.unfollowPlaylist(playlistId);
      this.spotifyApi.resetAccessToken();
      return res.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  editPlaylistDetails = async (accessToken: string, playlistId: string, options: Object) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const res = await this.spotifyApi.changePlaylistDetails(playlistId, options);
      this.spotifyApi.resetAccessToken();
      return res.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  addPlaylistImage = async (accessToken: string, playlistId: string, imgData: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const res = await this.spotifyApi.uploadCustomPlaylistCoverImage(playlistId, imgData);
      this.spotifyApi.resetAccessToken();
      return res.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  createPlaylist = async (accessToken: string,
    playlistName: string,
    options: { description?: string, collaborative: boolean, public: boolean }) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.createPlaylist(playlistName, options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  setVolume = async (accessToken: string, volume: number) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      await this.spotifyApi.setVolume(volume);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getArtistAlbums = async (accessToken: string, artistId: string, limit: number,
    market: string, offset: number, includeGroups?: string) => {
    try {
      const options: any = {
        limit, market, offset, include_groups: includeGroups,
      };
      this.spotifyApi.setAccessToken(accessToken);
      const albums = await this.spotifyApi.getArtistAlbums(artistId, options);
      this.spotifyApi.resetAccessToken();
      return albums.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getArtistTopTracks = async (accessToken: string, artistId: string, country: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const topTracks = await this.spotifyApi.getArtistTopTracks(artistId, country);
      this.spotifyApi.resetAccessToken();
      return topTracks.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // only 'before' is specified because we want to display the recently played tracks from the
  // current timestamp
  // we do not need the option 'after' in our case
  getMyRecentlyPlayedTracks = async (accessToken: string, before:number, limit:number) => {
    try {
      const options: any = { limit, before };
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getMyRecentlyPlayedTracks(options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getNewReleases = async (accessToken: string, country: string, limit: number, offset:number) => {
    try {
      const options: any = { country, limit, offset };
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getNewReleases(options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getMyTopArtists = async (
    accessToken: string, limit: number, offset:number, timeRange: string,
  ) => {
    try {
      const options: any = { limit, offset, time_range: timeRange };
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getMyTopArtists(options);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getArtist = async (accessToken: string, artistId: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getArtist(artistId);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getArtistRelatedArtists = async (accessToken: string, artistId: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getArtistRelatedArtists(artistId);
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getDevices = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getMyDevices();
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  getPlaybackState = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      const result = await this.spotifyApi.getMyCurrentPlaybackState();
      this.spotifyApi.resetAccessToken();
      return result.body;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  pause = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.pause();
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  play = async (accessToken: string, options: PlayOptions) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.play(options);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  previous = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.skipToPrevious();
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  next = async (accessToken: string) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.skipToNext();
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  removeTracks = async (accessToken: string, trackIds: ReadonlyArray<string>) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.removeFromMySavedTracks(trackIds);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  saveTracks = async (accessToken: string, trackIds: ReadonlyArray<string>) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.addToMySavedTracks(trackIds);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  seek = async (accessToken: string, position: number) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.seek(position);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  setDevice = async (accessToken: string,
    deviceIds: ReadonlyArray<string>,
    options: TransferPlaybackOptions) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.transferMyPlayback(deviceIds, options);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  setShuffle = async (accessToken: string, state: boolean) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.setShuffle(state);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  setRepeat = async (accessToken: string, state: RepeatState) => {
    try {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.setRepeat(state);
      this.spotifyApi.resetAccessToken();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
