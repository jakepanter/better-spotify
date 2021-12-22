import { API_URL } from "../utils/constants";

export const addToPlaylist = (playlistId: string, tracks: string[]) => {
  return fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tracks),
  });
};
