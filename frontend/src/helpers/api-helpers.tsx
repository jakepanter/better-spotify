import { API_URL } from "../utils/constants";
import { CreatePlaylistResponse, SinglePlaylistResponse } from "spotify-types";
import store from "../utils/store";

export const addToPlaylist = (playlistId: string, tracks: string[]) => {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(tracks),
  });
};

export const fetchPlaylist = async (playlistId: string) => {
  const authHeader = getAuthHeader();
  return fetch(`${API_URL}api/spotify/playlist/${playlistId}`, {
    headers: {
      Authorization: authHeader,
    },
  }).then((res) => res.json().then((value) => value as SinglePlaylistResponse));
};

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
      Authorization: authHeader,
    },
    body: JSON.stringify(data),
  }).then((value) => {
    return value.json().then((value) => value as CreatePlaylistResponse);
  });
};

export const getAccessToken = () => store.getState().authentication.accessToken;

export const getAuthHeader = () => `Bearer ${store.getState().authentication.accessToken}`;
