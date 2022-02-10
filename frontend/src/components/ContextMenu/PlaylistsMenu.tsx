import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
  PlaylistTrackResponse,
} from "spotify-types";
import { ControlledMenu, MenuDivider, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import useSWR, { mutate } from "swr";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { useHistory } from "react-router-dom";
import { DashboardService } from "../Dashboard/Dashboard";
import { createNewPlaylist, getAuthHeader } from "../../helpers/api-helpers";
import { NotificationsService } from "../NotificationService/NotificationsService";

type Props = {
  data: PlaylistObjectSimplified;
  anchorPoint: { x: number; y: number };
};

//arbitrary number to limit the max tracks loaded initially
const MAX_TRACKS_LOADED = 250;
let offset = 0;

function PlaylistsMenu(props: Props) {
  const authHeader = getAuthHeader();
  const fetcher = (url: any) =>
    fetch(url, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());

  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });
  const state = useContext(AppContext);
  const history = useHistory();
  const [isOnStartpage, setIsOnStartpage] = useState<boolean>(
    DashboardService.containsPlaylist(props.data.id)
  );

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
    setIsOnStartpage(DashboardService.containsPlaylist(props.data.id));
    offset = 0;
  }, []);

  useEffect(() => {
    offset = 0;
  }, [props.data]);

  useEffect(() => {
    toggleMenu(true);
    setIsOnStartpage(DashboardService.containsPlaylist(props.data.id));
  }, [props.anchorPoint]);

  const getAllTracksOfPlaylist = async (playlist: PlaylistObjectSimplified): Promise<string[]> => {
    const total = playlist.tracks.total;
    const playlistId = playlist.id;
    let tracks: string[] = [];
    while (offset < total && offset < MAX_TRACKS_LOADED) {
      let response: PlaylistTrackResponse = await fetch(
        `${API_URL}api/spotify/playlist/${playlistId}/tracks?offset=${offset}`,
        { headers: { Authorization: authHeader } }
      ).then(async (res) => {
        return (await res.json()) as Promise<PlaylistTrackResponse>;
      });
      tracks = tracks.concat(
        response.items
          .filter((item) => item.track)
          .filter((item) => !item.is_local)
          .map((item) => item.track.uri)
      );
      offset += 50;
    }
    return tracks;
  };

  const addToPlaylist = async (playlistId: String, notify: boolean = false) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    const tracks = await getAllTracksOfPlaylist(props.data);

    // spotify API seems to only allow adding 100 tracks at a time so we have to do multiple requests
    let alreadyAddedTracks = 0;
    while (alreadyAddedTracks < tracks.length) {
      const subArray = tracks.slice(alreadyAddedTracks, alreadyAddedTracks + 100);
      await fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(subArray),
      });
      alreadyAddedTracks += 100;
    }

    if (notify) NotificationsService.push("success", "Added tracks to playlist");
  };

  const addToNewPlaylist = async () => {
    //create new playlist
    const options = {
      collaborative: false,
      public: false,
    };
    const newPlaylist: CreatePlaylistResponse = await createNewPlaylist("new playlist", options);
    //add tracks to new playlist
    await addToPlaylist(newPlaylist.id);
    mutate(`${API_URL}api/spotify/playlists`);
    history.push(`/playlist/${newPlaylist.id}`, { created: newPlaylist.id });

    NotificationsService.push("success", "Added tracks to new playlist");
  };

  const deletePlaylist = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    const playlistId = props.data.id;
    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/unfollow`, {
      headers: { Authorization: authHeader },
    });
    mutate(`${API_URL}api/spotify/playlists`);
    history.push(history.location.pathname, { unfollowed: playlistId });

    NotificationsService.push("success", "Removed playlist from library");
  };

  const toggleStartpage = () => {
    if (isOnStartpage) {
      DashboardService.removePlaylist(props.data.id);
      setIsOnStartpage(false);

      NotificationsService.push("success", "Added playlist to start page");
    } else {
      DashboardService.addPlaylist(props.data.id);
      setIsOnStartpage(true);

      NotificationsService.push("success", "Removed playlist from start page");
    }
  };

  const editDetails = async () => {
    state.setContextMenu({
      ...state.contextMenu,
      type: "edit-playlist-details",
      x: 1,
      y: 1,
      data: props.data,
    });
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
      {props.data.owner.id === me?.id && <MenuItem onClick={editDetails}>Edit Playlist</MenuItem>}
      <MenuItem onClick={deletePlaylist}>Unfollow</MenuItem>
    </ControlledMenu>
  );
}

export default PlaylistsMenu;
