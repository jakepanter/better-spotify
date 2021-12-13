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
  const { tracks, positionX, positionY } = props;
  const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>();
  const [me, setMe] = useState<CurrentUsersProfileResponse>();

  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });

  const fetchPlaylists = async () => {
    fetch(`http://localhost:5000/api/spotify/playlists`).then(async (res) => {
      const data: ListOfUsersPlaylistsResponse = await res.json();
      setPlaylists(data.items);
    });
  };

  const fetchMe = async () => {
    fetch(`http://localhost:5000/api/spotify/me`).then(async (res) => {
      const data: CurrentUsersProfileResponse = await res.json();
      setMe(data);
    });
  };

  useEffect(() => {
    toggleMenu(true);
    fetchPlaylists();
    fetchMe();
  }, []);

  const addToPlaylist = async (playlistId: String) => {
    props.onClose();
    await fetch(
      `http://localhost:5000/api/spotify/playlist/${playlistId}/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tracks),
      }
    );
  };

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={{ x: positionX, y: positionY }}
      onClose={() => toggleMenu(false)}
    >
      <MenuItem>Add to Queue</MenuItem>
      <SubMenu label={"Add to Playlist"}>
        {playlists &&
          me &&
          playlists
            .filter((list) => list.owner.id === me?.id)
            .map((list) => (
              <MenuItem
                key={list.id}
                onClick={() => {
                  addToPlaylist(list.id);
                }}
              >
                {list.name}
              </MenuItem>
            ))}
      </SubMenu>
      <MenuItem>Like</MenuItem>
    </ControlledMenu>
  );
}

export default TrackContextMenuWrapper;
