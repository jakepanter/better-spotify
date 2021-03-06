import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
  PlaylistTrackResponse,
  SinglePlaylistResponse,
  UsersFollowPlaylistReponse,
} from "spotify-types";
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import useSWR, { mutate } from "swr";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { useHistory } from "react-router-dom";
import { getAuthHeader } from "../../helpers/api-helpers";
import { DashboardService } from "../Dashboard/Dashboard";
import { NotificationsService } from "../NotificationService/NotificationsService";

type Props = {
  data: SinglePlaylistResponse;
  anchorPoint: { x: number; y: number };
};

//arbitrary number to limit the max tracks loaded initially
const MAX_TRACKS_LOADED = 250;
let offset = 0;

function PlaylistMenu(props: Props) {
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
  const [following, setFollowing] = useState<boolean>();

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

  useEffect(() => {
    isFollowingPlaylistData(props.data.id);
  }, [props.data]);

  async function isFollowingPlaylistData(playlistId: string) {
    if (!me) console.error("didnt fetch user profile");
    const authHeader = getAuthHeader();
    const data: UsersFollowPlaylistReponse = await fetch(
      `${API_URL}api/spotify/playlists/contains?playlistId=${playlistId}&ownerId=${me?.id}&followerIds=${me?.id}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    setFollowing(data[0]);
  }

  const getAllTracksOfPlaylist = async (playlist: PlaylistObjectSimplified): Promise<string[]> => {
    const total = playlist.tracks.total;
    const playlistId = playlist.id;
    let tracks: string[] = [];
    while (offset < total && offset < MAX_TRACKS_LOADED) {
      const authHeader = getAuthHeader();
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
          Authorization: authHeader,
        },
        body: JSON.stringify(subArray),
      });
      alreadyAddedTracks += 100;
    }

    NotificationsService.push("success", "Added tracks to other playlist");
  };

  const handleFollowButton = async () => {
    const playlistId = props.data.id;
    const authHeader = getAuthHeader();
    if (following) {
      await fetch(`${API_URL}api/spotify/playlist/${playlistId}/unfollow`, {
        headers: { Authorization: authHeader },
      });
      setFollowing(false);
      mutate(`${API_URL}api/spotify/playlists`);
      if (props.data.owner.id === me?.id) {
        history.push("/playlists", { unfollowed: playlistId });
      }
      NotificationsService.push("success", "Removed playlist from library");
    } else {
      await fetch(`${API_URL}api/spotify/playlist/${playlistId}/follow`, {
        headers: { Authorization: authHeader },
      });
      setFollowing(true);
      mutate(`${API_URL}api/spotify/playlists`);
      NotificationsService.push("success", "Added playlist to library");
    }
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
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

  const toggleStartpage = () => {
    if (isOnStartpage) {
      DashboardService.removePlaylist(props.data.id);
      setIsOnStartpage(false);
    } else {
      DashboardService.addPlaylist(props.data.id);
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
      <SubMenu label={"Add to Playlist"} disabled={props.data.tracks.total === 0}>
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
          <MenuItem disabled>Fetching Playlists...</MenuItem>
        )}
      </SubMenu>
      {props.data.owner.id === me?.id && <MenuItem onClick={editDetails}>Edit Playlist</MenuItem>}
      <MenuItem disabled={following === undefined} onClick={handleFollowButton}>
        {!following ? "Follow" : me?.id === props.data.owner.id ? "Delete" : "Unfollow"}
      </MenuItem>
    </ControlledMenu>
  );
}

export default PlaylistMenu;
