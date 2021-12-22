import React, { useEffect, useState } from "react";
import {
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import {
  ControlledMenu,
  MenuDivider,
  MenuItem,
  SubMenu,
  useMenuState,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import {API_URL} from "../../utils/constants";

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
    const playlistsRequest: Promise<ListOfUsersPlaylistsResponse> = fetch(`${API_URL}api/spotify/playlists`)
        .then(async (res) => {
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

  const addToPlaylist = async (playlistId: String) => {
    props.onClose();
    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const tracks = props.tracks.map((track) => track.split("-")[0]);
    await fetch(
        `${API_URL}api/spotify/playlist/${playlistId}/add`,
        { method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tracks)
        }
    );
  };

  const addToNewPlaylist = async () => {
    props.onClose();
    //create new playlist
    const number = myPlaylists ? myPlaylists.length + 1 : '-1';
    const data = {
      playlistName: "coole neue playlist #" + number,
      options: {
        collaborative: false,
        public: false,
      },
    };
    const newPlaylist: CreatePlaylistResponse = await fetch(`${API_URL}api/spotify/playlists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json());
    //add tracks to new playlist
    addToPlaylist(newPlaylist.id);
  }

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={anchorPoint}
      onClose={() => toggleMenu(false)}
    >
      <MenuItem>Add to Queue</MenuItem>
      <SubMenu label={"Add to Playlist"}>
        <MenuItem onClick={addToNewPlaylist}>Add to new Playlist</MenuItem>
        <MenuDivider />
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
