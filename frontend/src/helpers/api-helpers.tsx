import { API_URL } from "../utils/constants";
import { CreatePlaylistResponse } from "spotify-types";

export const addToPlaylist = (playlistId: string, tracks: string[]) => {
  return fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tracks),
  });
};

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
