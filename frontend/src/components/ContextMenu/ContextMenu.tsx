import React, { useEffect, useState } from "react";
import {
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
  const [playlists, setPLaylists] = useState<PlaylistObjectSimplified[]>();
  const [showPlaylistsMenu, setShowPlaylistsMenu] = useState<boolean>(false);

  const fetchPlaylists = async () => {
    fetch(`http://localhost:5000/api/spotify/playlists`).then(async (res) => {
      const data: ListOfUsersPlaylistsResponse = await res.json();
      setPLaylists(data.items);
    });
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const addToPlaylist = async (playlistId: String) => {
    console.log(playlistId);
    console.log(JSON.stringify({ tracks: tracks }));
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

  return (
    <>
      <div
        className={`ContextMenu`}
        style={{
          left: positionX + "px",
          top: positionY + "px",
        }}
      >
        <ul onMouseLeave={() => setShowPlaylistsMenu(false)}>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>Add to Queue</li>
          <li
            onMouseOver={() => {
              setShowPlaylistsMenu(true);
            }}
          >
            Add to Playlist &gt;
            {showPlaylistsMenu && (
              <ul
                onMouseOver={() => {
                  setShowPlaylistsMenu(true);
                }}
              >
                {playlists &&
                  playlists.map((list) => (
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
            )}
          </li>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>Like Song</li>
          <li onMouseEnter={() => setShowPlaylistsMenu(false)}>More Info</li>
        </ul>
      </div>
    </>
  );
}

export default ContextMenu;
