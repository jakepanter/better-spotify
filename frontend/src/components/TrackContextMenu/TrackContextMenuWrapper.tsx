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
import { API_URL } from "../../utils/constants";
import { addToPlaylist } from "../../helpers/api-helpers";

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
      `${API_URL}api/spotify/playlists`
    ).then(async (res) => {
      return await res.json();
    });
    const meRequest: Promise<CurrentUsersProfileResponse> = fetch(
      `${API_URL}api/spotify/me`
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

  const handleAddToPlaylist = async (playlistId: string) => {
    props.onClose();
    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const tracks = props.tracks.map((track) => track.split("-")[0]);
    await addToPlaylist(playlistId, tracks);
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
                handleAddToPlaylist(list.id);
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
