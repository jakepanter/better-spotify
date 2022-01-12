import React, { useContext, useEffect, useRef } from "react";
import { API_URL } from "../../utils/constants";
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import { CurrentUsersProfileResponse, ListOfUsersPlaylistsResponse } from "spotify-types";
import AppContext from "../../AppContext";
import useSWR from "swr";
import "./ContextMenu.scss";
import useOutsideClick from "../../helpers/useOutsideClick";
import { useHistory } from "react-router-dom";

type Props = {
  data: String[];
  anchorPoint: { x: number; y: number };
};

const fetcher = (url: any) => fetch(url).then((r) => r.json());

function TracksMenu(props: Props) {
  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
  const state = useContext(AppContext);
  let history = useHistory();

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

  const showAlbum = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //extract track id
    const trackId = props.data.map((track) => track.split("track:")[1].split("-")[0])[0];
    const track: any = await fetch(`${API_URL}api/spotify/track/${trackId}`).then((r) => r.json());
    history.push(`/album/${track.album.id}`);
  };

  const showArtist = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //extract track id
    const trackId = props.data.map((track) => track.split("track:")[1].split("-")[0])[0];
    const track: any = await fetch(`${API_URL}api/spotify/track/${trackId}`).then((r) => r.json());
    history.push(`/artist/${track.artists[0].id}`);
  };

  if (playlistsError || meError) return <p>error</p>;

  if (props.data.length === 1) {
    return (
      <ControlledMenu
        {...menuProps}
        anchorPoint={props.anchorPoint}
        onClose={() => toggleMenu(false)}
        ref={ref}
      >
        <MenuItem disabled>Add to Queue</MenuItem>
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
        <MenuItem disabled onClick={showArtist}>
          Show Artist
        </MenuItem>
        <MenuItem onClick={showAlbum}>Show Album</MenuItem>
        <MenuItem disabled>Like</MenuItem>
      </ControlledMenu>
    );
  } else {
    return (
      <ControlledMenu
        {...menuProps}
        anchorPoint={props.anchorPoint}
        onClose={() => toggleMenu(false)}
        ref={ref}
      >
        <MenuItem disabled>Add to Queue</MenuItem>
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
        <MenuItem disabled>Like</MenuItem>
      </ControlledMenu>
    );
  }
}

export default TracksMenu;
