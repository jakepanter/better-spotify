import React, { useContext, useEffect, useRef } from "react";
import {
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
  PlaylistTrackResponse,
  SinglePlaylistResponse,
} from "spotify-types";
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import useSWR, { mutate } from "swr";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { useHistory } from "react-router-dom";
import { getAuthHeader } from '../../helpers/api-helpers';

type Props = {
  data: SinglePlaylistResponse;
  anchorPoint: { x: number; y: number };
};

const fetcher = (url: any) => {
  const authHeader = getAuthHeader();
  return fetch(url, {
    headers: {
      'Authorization': authHeader
    }
  }).then((r) => r.json());
}

//arbitrary number to limit the max tracks loaded initially
const MAX_TRACKS_LOADED = 250;
let offset = 0;

function PlaylistMenu(props: Props) {
  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
  const state = useContext(AppContext);
  const history = useHistory();

  const { data: playlists, error: playlistsError } = useSWR<ListOfUsersPlaylistsResponse>(
    `${API_URL}api/spotify/playlists`,
    fetcher
  );
  const { data: me, error: meError } = useSWR<CurrentUsersProfileResponse>(
    `${API_URL}api/spotify/me`,
    fetcher
  );

  const ref = useRef();
  useOutsideClick(ref, () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  });

  useEffect(() => {
    toggleMenu(true);
  }, []);

  useEffect(() => {
    toggleMenu(true);
  }, [props.anchorPoint]);

  const getAllTracksOfPlaylist = async (playlist: PlaylistObjectSimplified): Promise<string[]> => {
    const total = playlist.tracks.total;
    const playlistId = playlist.id;
    let tracks: string[] = [];
    while (offset < total && offset < MAX_TRACKS_LOADED) {
      const authHeader = getAuthHeader();
      let response: PlaylistTrackResponse = await fetch(
        `${API_URL}api/spotify/playlist/${playlistId}/tracks?offset=${offset}`, {
            headers: {
              'Authorization': authHeader
            }
          }).then(async (res) => {
        return (await res.json()) as Promise<PlaylistTrackResponse>;
      });
      tracks = tracks.concat(response.items.map((item) => item.track.uri));
      offset += 50;
    }
    return tracks;
  };

  const addToPlaylist = async (playlistId: String) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    const tracks = await getAllTracksOfPlaylist(props.data);

    // spotify API seems to only allow adding 100 tracks at a time so we have to do multiple requests
    let alreadyAddedTracks = 0;
    while (alreadyAddedTracks < tracks.length) {
      const subArray = tracks.slice(alreadyAddedTracks, alreadyAddedTracks + 100);
      const authHeader = getAuthHeader();
      fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': authHeader
        },
        body: JSON.stringify(subArray),
      });
      alreadyAddedTracks += 100;
    }
  };

  const deletePlaylist = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    const playlistId = props.data.id;
    const authHeader = getAuthHeader();
    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/unfollow`, {
      headers: {
        'Authorization': authHeader
      }
    });
    mutate(`${API_URL}api/spotify/playlists`);
    history.push("/playlists");
  };

  if (playlistsError || meError) return <p>error</p>;

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={props.anchorPoint}
      onClose={() => toggleMenu(false)}
      ref={ref}
    >
      <MenuItem disabled>Add to Queue</MenuItem>
      <MenuItem disabled>Add to Startpage</MenuItem>
      <SubMenu label={"Add to Playlist"}>
        {playlists && me ? (
          playlists.items
            .filter((list) => list.owner.id === me.id)
            .map((list) => (
              <MenuItem
                key={list.id}
                onClick={() => {
                  addToPlaylist(list.id);
                }}
              >
                {list.name}
              </MenuItem>
            ))
        ) : (
          <MenuItem>Fetching Playlists...</MenuItem>
        )}
      </SubMenu>
      <MenuItem onClick={deletePlaylist}>Unfollow</MenuItem>
    </ControlledMenu>
  );
}

export default PlaylistMenu;
