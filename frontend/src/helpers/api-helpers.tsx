import { CreatePlaylistResponse } from "spotify-types";
import { API_URL } from "../utils/constants";
import store from '../utils/store';

export const createNewPlaylist = async (
  name: string,
  options: { description?: string; collaborative: boolean; public: boolean }
): Promise<CreatePlaylistResponse> => {
  const data = {
    playlistName: name,
    options: options,
  };
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': authHeader
    },
    body: JSON.stringify(data),
  }).then((value) => {
    return value.json().then((value) => value as CreatePlaylistResponse);
  });
};

export const getAccessToken = () => store.getState().authentication.accessToken;

export const getAuthHeader = () => `Bearer ${store.getState().authentication.accessToken}`;
