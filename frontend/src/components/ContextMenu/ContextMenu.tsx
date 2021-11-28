import React, { useEffect, useState } from "react";
import {
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./ContextMenu.scss";

type Props = {
  tracks: String[];
  positionX: number;
  positionY: number;
};

function ContextMenu(props: Props) {
  const { tracks, positionX, positionY } = props;
  const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>();
  const [me, setMe] = useState<CurrentUsersProfileResponse>();
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [childWidth, setChildWidth] = useState<number>(0);
  const [childHeight, setChildHeight] = useState<number>(0);
  const [showPlaylistsMenu, setShowPlaylistsMenu] = useState<boolean>(false);

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
    fetchPlaylists();
    fetchMe();
  }, []);

  const addToPlaylist = async (playlistId: String) => {
    // console.log(playlistId);
    // console.log(JSON.stringify({ tracks: tracks }));
    setShowPlaylistsMenu(false);
    await fetch(
      `http://localhost:5000/api/spotify/playlist/${playlistId}/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tracks),
      }
    );
  };

  const enoughSpaceToLeft = (posX: number, width: number) => {
    return window.innerWidth - posX >= width;
  };

  const enoughSpaceToBottom = (posY: number, height: number) => {
    return window.innerHeight - posY >= height;
  };

  return (
    <>
      <div
        className={`ContextMenu`}
        ref={(el) => {
          if (!el) return;
          setWidth(el.getBoundingClientRect().width);
          setHeight(el.getBoundingClientRect().height);
        }}
        style={{
          left: enoughSpaceToLeft(positionX, width)
            ? positionX + "px"
            : positionX - width + "px",
          top: enoughSpaceToBottom(positionY, height)
            ? positionY + "px"
            : positionY - height + "px",
        }}
      >
        <ul>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>Add to Queue</li>
          <li
            onMouseOver={() => {
              setShowPlaylistsMenu(true);
            }}
          >
            Add to Playlist &gt;
          </li>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>Like Song</li>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>More Info</li>
        </ul>
      </div>

      {showPlaylistsMenu && (
        <div
          className={`ContextMenu`}
          ref={(el) => {
            if (!el) return;
            setChildWidth(el.getBoundingClientRect().width);
            setChildHeight(el.getBoundingClientRect().height);
          }}
          style={{
            left: enoughSpaceToLeft(positionX + width, childWidth)
              ? positionX + width + "px"
              : enoughSpaceToLeft(positionX, width)
              ? positionX - childWidth + "px"
              : positionX - width - childWidth + "px",
            top: enoughSpaceToBottom(positionY, childHeight)
              ? positionY + 26.5 + "px"
              : positionY - childHeight + 26.5 * 2 + "px",
          }}
        >
          <ul
            onMouseOver={() => {
              setShowPlaylistsMenu(true);
            }}
          >
            {playlists &&
              me &&
              playlists
                .filter((list) => list.owner.id === me?.id)
                .map((list) => (
                  <li
                    key={list.id}
                    onClick={() => {
                      addToPlaylist(list.id);
                    }}
                  >
                    {list.name}
                  </li>
                ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default ContextMenu;
