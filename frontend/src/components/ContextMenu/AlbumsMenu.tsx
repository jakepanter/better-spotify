import React, { useContext, useEffect, useRef } from "react";
import {
  AlbumObjectFull,
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
} from "spotify-types";
import { ControlledMenu, MenuDivider, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import useSWR, { mutate } from "swr";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { createNewPlaylist } from "../../helpers/api-helpers";
import { useHistory } from "react-router-dom";

type Props = {
  data: AlbumObjectFull;
  anchorPoint: { x: number; y: number };
};

const fetcher = (url: any) => fetch(url).then((r) => r.json());

function AlbumsMenu(props: Props) {
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
    const tracks = props.data.tracks.items.map((track) => track.uri);

    fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
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
      <MenuItem disabled>Add to Queue</MenuItem>
      <MenuItem disabled>Add to Startpage</MenuItem>
      <SubMenu label={"Add to Playlist"}>
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
      </SubMenu>
      <MenuItem disabled>Remove from Library</MenuItem>
    </ControlledMenu>
  );
}

export default AlbumsMenu;
