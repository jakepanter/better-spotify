import { CreatePlaylistResponse } from "spotify-types";
import { API_URL, AUTH_LOCAL_STORAGE_KEY } from "../utils/constants";

export const createNewPlaylist = async (
  name: string,
  options: { description?: string; collaborative: boolean; public: boolean }
): Promise<CreatePlaylistResponse> => {
  const data = {
    playlistName: name,
    options: options,
  };
  return fetch(`${API_URL}api/spotify/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((value) => {
    return value.json().then((value) => value as CreatePlaylistResponse);
  });
};

export const getAccessToken = () => {
  const localAuth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY) as string;
  return JSON.parse(localAuth).accessToken;
};

export const getAuthHeader = () => {
  const localAuth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY) as string;
  return `Bearer ${JSON.parse(localAuth).accessToken}`;
};