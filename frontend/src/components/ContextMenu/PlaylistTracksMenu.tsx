import "./ContextMenu.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ControlledMenu, MenuDivider, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import {
  CheckUsersSavedTracksResponse,
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectFull,
  SingleTrackResponse,
} from "spotify-types";
import AppContext from "../../AppContext";
import useSWR, { mutate } from "swr";
import useOutsideClick from "../../helpers/useOutsideClick";
import { createNewPlaylist, getAuthHeader } from "../../helpers/api-helpers";
import { API_URL } from "../../utils/constants";
import TagsSystem from "../../utils/tags-system";
import { NotificationsService } from "../NotificationService/NotificationsService";

type Props = {
  data: { tracks: String[]; playlist: PlaylistObjectFull };
  anchorPoint: { x: number; y: number };
};

function PlaylistTracksMenu(props: Props) {
  const authHeader = getAuthHeader();
  const fetcher = (url: any) =>
    fetch(url, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());

  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });

  const tags = TagsSystem.getTags();
  const [trackId, setTrackId] = useState(
    props.data.tracks.map((track) => track.split("-")[0].split(":")[2])[0]
  );
  const [tagsForTrack, setTagsForTrack] = useState<string[]>(TagsSystem.getTagsOfElement(trackId));
  const [isLiked, setIsLiked] = useState<boolean>(false);

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
  const { data: track, error: trackError } = useSWR<SingleTrackResponse>(
    `${API_URL}api/spotify/track/${trackId}`,
    fetcher
  );
  const { data: liked, error: likedError } = useSWR<CheckUsersSavedTracksResponse>(
    `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackId}`,
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
    setTagsForTrack(TagsSystem.getTagsOfElement(trackId));
  }, [trackId]);

  useEffect(() => {
    toggleMenu(true);
    setTrackId(props.data.tracks.map((track) => track.split("-")[0].split(":")[2])[0]);
  }, [props.anchorPoint, props.data]);

  useEffect(() => {
    if (liked !== undefined) {
      setIsLiked(liked[0]);
    }
  }, [liked]);

  // Notifications
  useEffect(() => {
    if ([playlistsError, meError, trackError, likedError].some((value) => value !== undefined)) {
      NotificationsService.push('error', 'Something went wrong while fetching data from the backend');
    }
  }, [playlistsError, meError, trackError, likedError]);

  const addToPlaylist = async (playlistId: String, notify: boolean = false) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const tracks = props.data.tracks.map((track) => track.split("-")[0]);
    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(tracks),
    });
    if (notify)
      NotificationsService.push(
        "success",
        `Added track${props.data.tracks.length > 1 ? "s" : ""} to playlist`
      );
  };

  const removeFromPlaylist = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const data = props.data.tracks.map((track) => track.split("-"));
    const tracks = data.map((track) => {
      return { uri: track[0], positions: [parseInt(track[1])] };
    });
    await fetch(`${API_URL}api/spotify/playlist/${props.data.playlist.id}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(tracks),
    });
    history.push(history.location.pathname, { removed: tracks });

    NotificationsService.push(
      "success",
      `Removed track${props.data.tracks.length > 1 ? "s" : ""} from playlist`
    );
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

    NotificationsService.push(
      "success",
      `Added track${props.data.tracks.length > 1 ? "s" : ""} to new playlist`
    );
  };

  const showAlbum = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    history.push(`/album/${track!.album.id}`);
  };

  const showArtist = async (index?: number) => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    history.push(`/artist/${track!.artists[index ?? 0].id}`);
  };

  const setTags = (tagId: string, checked: boolean) => {
    if (checked) {
      TagsSystem.addTagToElement(trackId, tagId);
    } else {
      TagsSystem.removeTagFromElement(trackId, tagId);
    }
    setTagsForTrack(TagsSystem.getTagsOfElement(trackId));
  };

  const navigateToTags = () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    history.push(`/settings`);
  };

  const handleLikeButton = async () => {
    if (isLiked) {
      // remove
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/remove?trackIds=${trackId}`, {
        headers: {
          'Authorization': authHeader
        }
      }).then((res) =>
        res.json()
      );
      setIsLiked(false);
      NotificationsService.push('success', 'Removed track from saved tracks');
    } else {
      // add
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/add?trackIds=${trackId}`, {
        headers: {
          'Authorization': authHeader
        }
      }).then((res) =>
        res.json()
      );
      setIsLiked(true);
      NotificationsService.push('success', 'Added track to saved tracks');
    }
  };

  if (playlistsError || meError || trackError) return <p>error</p>;

  if (props.data.tracks.length === 1) {
    return (
      <ControlledMenu
        {...menuProps}
        anchorPoint={props.anchorPoint}
        onClose={() => toggleMenu(false)}
        ref={ref}
      >
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
        {props.data.playlist.owner.id === me?.id && (
          <MenuItem onClick={removeFromPlaylist}>Remove from Playlist</MenuItem>
        )}
        <SubMenu label={"Edit Tags"} overflow={"auto"} position={"anchor"}>
          <MenuItem onClick={navigateToTags}>New Tag</MenuItem>
          {Object.keys(tags.availableTags).length > 0 && <MenuDivider />}
          {Object.entries(tags.availableTags).map((e) => (
            <MenuItem
              key={e[0]}
              type={"checkbox"}
              checked={tagsForTrack.includes(e[0])}
              onClick={(event) =>
                setTags(e[0], event.checked !== undefined ? event.checked : false)
              }
            >
              {e[1].title}
            </MenuItem>
          ))}
        </SubMenu>
        {track && track.artists.length > 1 ? (
          <SubMenu label={"Show Artist"}>
            {track.artists.map((a, i) => (
              <MenuItem key={a.name} onClick={() => showArtist(i)}>
                {a.name}
              </MenuItem>
            ))}
          </SubMenu>
        ) : (
          <MenuItem onClick={() => showArtist()}>Show Artist</MenuItem>
        )}
        <MenuItem onClick={showAlbum}>Show Album</MenuItem>
        <MenuItem disabled={liked === undefined}
                  onClick={() => handleLikeButton()}>
          {isLiked ? 'Dislike' : 'Like'}
        </MenuItem>
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
            <MenuItem>Fetching Playlists...</MenuItem>
          )}
        </SubMenu>
        {props.data.playlist.owner.id === me?.id && (
          <MenuItem onClick={removeFromPlaylist}>Remove from Playlist</MenuItem>
        )}
      </ControlledMenu>
    );
  }
}

export default PlaylistTracksMenu;
