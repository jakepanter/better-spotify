import React, { useContext, useEffect, useRef } from "react";
import { API_URL } from "../../utils/constants";
import { ControlledMenu, MenuDivider, MenuItem, useMenuState } from "@szhsin/react-menu";
import {
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
} from "spotify-types";
import AppContext from "../../AppContext";
import useSWR, { mutate } from "swr";
import "./ContextMenu.scss";
import useOutsideClick from "../../helpers/useOutsideClick";
import { createNewPlaylist } from "../../helpers/api-helpers";
import { useHistory } from "react-router-dom";

type Props = {
  data: String[];
  anchorPoint: { x: number; y: number };
};

const fetcher = (url: any) => fetch(url).then((r) => r.json());

function AddToPlaylistsMenu(props: Props) {
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

  const addToPlaylist = async (playlistId: String) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });

    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const tracks = props.data.map((track) => track.split("-")[0]);
    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tracks),
    });
  };

  const addToNewPlaylist = async () => {
    //create new playlist
    // const number = playlists ? playlists.items.length + 1 : "-1";
    const options = {
      collaborative: false,
      public: false,
    };
    const newPlaylist: CreatePlaylistResponse = await createNewPlaylist(
      "coole neue playlist",
      options
    );
    //add tracks to new playlist
    await addToPlaylist(newPlaylist.id);
    mutate(`${API_URL}api/spotify/playlists`);
    history.push(`/playlist/${newPlaylist.id}`, { created: newPlaylist.id });
  };

  if (playlistsError || meError) return <p>error</p>;

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={props.anchorPoint}
      onClose={() => toggleMenu(false)}
      ref={ref}
    >
      <MenuItem onClick={addToNewPlaylist}>Add to new Playlist</MenuItem>
      <MenuDivider />
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
    </ControlledMenu>
  );
}

export default AddToPlaylistsMenu;
