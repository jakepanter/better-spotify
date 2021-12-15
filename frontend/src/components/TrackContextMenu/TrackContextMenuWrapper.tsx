import React, { useEffect, useState } from "react";
import {
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import {
  ControlledMenu,
  MenuItem,
  SubMenu,
  useMenuState,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

type Props = {
  tracks: String[];
  positionX: number;
  positionY: number;
  onClose: () => void;
};

function TrackContextMenuWrapper(props: Props) {
  const [anchorPoint, setAnchorPoint] = useState({
    x: props.positionX,
    y: props.positionY,
  });
  const [myPlaylists, setMyPlaylists] = useState<PlaylistObjectSimplified[]>();

  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });

  const fetchMyPlaylists = async () => {
    const playlistsRequest: Promise<ListOfUsersPlaylistsResponse> = fetch(
      `http://localhost:5000/api/spotify/playlists`
    ).then(async (res) => {
      return await res.json();
    });
    const meRequest: Promise<CurrentUsersProfileResponse> = fetch(
      `http://localhost:5000/api/spotify/me`
    ).then(async (res) => {
      return await res.json();
    });
    Promise.all([playlistsRequest, meRequest]).then(([playlists, me]) => {
      setMyPlaylists(playlists.items.filter((list) => list.owner.id === me.id));
    });
  };

  useEffect(() => {
    toggleMenu(true);
    fetchMyPlaylists();
  }, []);

  useEffect(() => {
    setAnchorPoint({ x: props.positionX, y: props.positionY });
    toggleMenu(true);
  }, [props.positionX, props.positionY]);

  const addToPlaylist = async (playlistId: String) => {
    props.onClose();
    await fetch(
      `http://localhost:5000/api/spotify/playlist/${playlistId}/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props.tracks),
      }
    );
  };

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={anchorPoint}
      onClose={() => toggleMenu(false)}
    >
      <MenuItem>Add to Queue</MenuItem>
      <SubMenu label={"Add to Playlist"}>
        {myPlaylists ? (
          myPlaylists.map((list) => (
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
      <MenuItem>Like</MenuItem>
    </ControlledMenu>
  );
}

export default TrackContextMenuWrapper;
