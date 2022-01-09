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
import {API_URL} from "../../utils/constants";
import TagsSystem from "../../utils/tags-system";

type Props = {
  tracks: String[];
  positionX: number;
  positionY: number;
  onClose: () => void;
};

function TrackContextMenuWrapper(props: Props) {
  const trackId = props.tracks.map((track) => track.split("-")[0].split(':')[2])[0];

  const tags = TagsSystem.getTags();
  const [tagsForTrack, setTagsForTrack] = useState<string[]>(TagsSystem.getTagsOfElement(trackId));

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

  const setTags = (tagId: string, checked: boolean) => {
    if (checked) {
      TagsSystem.addTagToElement(trackId, tagId);
    } else {
      TagsSystem.removeTagFromElement(trackId, tagId);
    }
    setTagsForTrack(TagsSystem.getTagsOfElement(trackId));
  }

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
      <SubMenu label={"Tags"}
               overflow={"auto"}
               position={"anchor"}
               disabled={Object.keys(tags.availableTags).length === 0}
      >
        {Object.entries(tags.availableTags).map((e) =>
          <MenuItem key={e[0]}
                    type={"checkbox"}
                    checked={tagsForTrack.includes(e[0])}
                    onClick={(event) => setTags(e[0], event.checked !== undefined ? event.checked : false)}
          >
            {e[1].title}
          </MenuItem>
        )}
      </SubMenu>
    </ControlledMenu>
  );
}

export default TrackContextMenuWrapper;
