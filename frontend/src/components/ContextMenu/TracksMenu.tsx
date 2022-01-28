import "./ContextMenu.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ControlledMenu, MenuDivider, MenuItem, SubMenu, useMenuState } from "@szhsin/react-menu";
import {
  CreatePlaylistResponse,
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
} from "spotify-types";
import AppContext from "../../AppContext";
import useSWR, { mutate } from "swr";
import useOutsideClick from "../../helpers/useOutsideClick";
import { createNewPlaylist, getAuthHeader } from "../../helpers/api-helpers";
import { API_URL } from "../../utils/constants";
import TagsSystem from "../../utils/tags-system";

type Props = {
  data: String[];
  anchorPoint: { x: number; y: number };
};

const authHeader = getAuthHeader();
const fetcher = (url: any) =>
  fetch(url, {
    headers: { Authorization: authHeader },
  }).then((r) => r.json());

function TracksMenu(props: Props) {
  const { toggleMenu, ...menuProps } = useMenuState({ transition: true });

  const trackId = props.data.map((track) => track.split("-")[0].split(":")[2])[0];
  const tags = TagsSystem.getTags();
  const [tagsForTrack, setTagsForTrack] = useState<string[]>(TagsSystem.getTagsOfElement(trackId));
  const [liked, setLiked] = useState<boolean>(false);

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
    //HACKY: because props.tracks contains the trackUniqueId[] we have to remove the -id at the end from each track
    const tracks = props.data.map((track) => track.split("-")[0]);
    await fetch(`${API_URL}api/spotify/playlist/${playlistId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
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

  const showAlbum = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //extract track id
    const trackId = props.data.map((track) => track.split("track:")[1].split("-")[0])[0];
    const track: any = await fetch(`${API_URL}api/spotify/track/${trackId}`, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());
    history.push(`/album/${track.album.id}`);
  };

  const showArtist = async () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    //extract track id
    const trackId = props.data.map((track) => track.split("track:")[1].split("-")[0])[0];
    const track: any = await fetch(`${API_URL}api/spotify/track/${trackId}`, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());
    history.push(`/artist/${track.artists[0].id}`);
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

  const handleLikeButton = async (e: any) => {
    e.stopPropagation();
    if (!liked) {
      // add
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/add?trackIds=${trackId}`, {
        headers: {
          'Authorization': authHeader
        }
      }).then((res) =>
        res.json()
      );
      setLiked(true);
    } else {
      // remove
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/remove?trackIds=${trackId}`, {
        headers: {
          'Authorization': authHeader
        }
      }).then((res) =>
        res.json()
      );
      setLiked(false);
    }
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
        <SubMenu label={"Tags"} overflow={"auto"} position={"anchor"}>
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
        <MenuItem onClick={handleLikeButton}>
          {liked ? 'Dislike' : 'Like'}
        </MenuItem>
      </ControlledMenu>
    );
  }
}

export default TracksMenu;
