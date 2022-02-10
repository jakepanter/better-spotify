import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AlbumObjectFull,
  AlbumObjectSimplified,
  CheckUserSavedAlbumsResponse,
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
import { createNewPlaylist, getAuthHeader } from "../../helpers/api-helpers";
import { useHistory } from "react-router-dom";
import { DashboardService } from "../Dashboard/Dashboard";
import { NotificationsService } from "../NotificationService/NotificationsService";

type Props = {
  data: AlbumObjectFull | AlbumObjectSimplified;
  anchorPoint: { x: number; y: number };
};

function AlbumsMenu(props: Props) {
  const authHeader = getAuthHeader();
  const fetcher = (url: any) =>
    fetch(url, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());

  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
  const state = useContext(AppContext);
  const history = useHistory();
  const [isOnStartpage, setIsOnStartpage] = useState<boolean>(
    DashboardService.containsAlbum(props.data.id)
  );
  const [liked, setLiked] = useState<boolean>();

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
    setIsOnStartpage(DashboardService.containsAlbum(props.data.id));
  }, []);

  useEffect(() => {
    isAlbumSavedData([props.data.id]);
  }, [props.data]);

  useEffect(() => {
    toggleMenu(true);
    setIsOnStartpage(DashboardService.containsAlbum(props.data.id));
  }, [props.anchorPoint]);

  const addToPlaylist = async (playlistId: String, notify: boolean = false) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    let tracks;
    if ("tracks" in props.data) {
      tracks = props.data.tracks.items.map((track) => track.uri);
    } else {
      const fullAlbum: AlbumObjectFull = await fetcher(
        `${API_URL}api/spotify/album/${props.data.id}`
      );
      tracks = fullAlbum.tracks.items.map((track) => track.uri);
    }

    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(tracks),
    });

    if (notify) NotificationsService.push("success", "Added tracks to playlist");
  };

  async function isAlbumSavedData(albumIds: string[]) {
    const authHeader = getAuthHeader();
    const data: CheckUserSavedAlbumsResponse = await fetch(
      `${API_URL}api/spotify/me/albums/contains?albumIds=${albumIds}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    //get Saved Status and set it
    setLiked(data[0]);
  }

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

    NotificationsService.push("success", "Added tracks to new playlist");
  };

  const handleLikeButton = async () => {
    console.log("liked");
    if (props.data !== undefined) {
      if (!liked) {
        // add
        const authHeader = getAuthHeader();
        await fetch(`${API_URL}api/spotify/me/albums/add?albumIds=${props.data.id}`, {
          headers: {
            Authorization: authHeader,
          },
        }).then((res) => res.json());
        setLiked(true);
        history.push(history.location.pathname, { added: props.data });
      } else {
        // remove
        const authHeader = getAuthHeader();
        await fetch(`${API_URL}api/spotify/me/albums/remove?albumIds=${props.data.id}`, {
          headers: {
            Authorization: authHeader,
          },
        }).then((res) => res.json());
        setLiked(false);
        history.push(history.location.pathname, { removed: props.data });
      }
    }
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  };

  const toggleStartpage = () => {
    if (isOnStartpage) {
      DashboardService.removeAlbum(props.data.id);
      setIsOnStartpage(false);
    } else {
      DashboardService.addAlbum(props.data.id);
      setIsOnStartpage(true);
    }
  };

  if (playlistsError || meError) return <p>error</p>;

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={props.anchorPoint}
      onClose={() => toggleMenu(false)}
      ref={ref}
    >
      <MenuItem onClick={() => toggleStartpage()}>
        {isOnStartpage ? "Remove from Startpage" : "Add to Startpage"}
      </MenuItem>
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
                  addToPlaylist(list.id, true);
                }}
              >
                {list.name}
              </MenuItem>
            ))
        ) : (
          <MenuItem disabled>Fetching Playlists...</MenuItem>
        )}
      </SubMenu>
      <MenuItem onClick={handleLikeButton} disabled={liked === undefined}>
        {liked ? "Remove from" : "Add to"} Library
      </MenuItem>
    </ControlledMenu>
  );
}

export default AlbumsMenu;
