import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppContext from "../../AppContext";
import "../../cards.scss";
import {
  CreatePlaylistResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { createNewPlaylist } from "../../helpers/api-helpers";

export default function Playlists() {
  const [playlists, setPlaylists] = useState<ListOfUsersPlaylistsResponse>();
  const [items, setItems] = useState<PlaylistObjectSimplified[]>([]);
  const [next, setNext] = useState<string>(`${API_URL}api/spotify/playlists`);
  const state = useContext(AppContext);
  const location = useLocation<any>();

  useEffect(() => {
    fetchData(next);
  }, []);

  useEffect(() => {
    // remove unfollowed playlist from items
    if (location.state && location.state.unfollowed) {
      const unfollowedPlaylistId = location.state.unfollowed;
      setItems(items.filter((list) => list.id !== unfollowedPlaylistId));
    }
  }, [location]);

  async function fetchData(url: string) {
    const data: ListOfUsersPlaylistsResponse = await fetch(url).then((res) => res.json());
    setPlaylists(data);
    const arr: PlaylistObjectSimplified[] = [...items, ...data.items];
    setItems(arr);
  }

  const handleRightClick = (e: any, playlistId: string) => {
    e.preventDefault();
    //pass clicked playlist to context menu (doesnt contain tracks)
    const playlist = items.find((playlist) => playlist.id === playlistId);
    state.setContextMenu({
      ...state.contextMenu,
      type: "playlists",
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      data: playlist,
    });
  };

  const handleCreateNewPlaylist = async () => {
    // const number = items ? items.length + 1 : "-1";
    const options = {
      collaborative: false,
      public: false,
    };
    const newPlaylist: CreatePlaylistResponse = await createNewPlaylist(
      "coole neue playlist",
      options
    );
    const arr = [newPlaylist, ...items];
    setItems(arr);
  };

  //fetch next playlists when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && playlists) {
      const limit = playlists.limit;
      const offset = playlists.offset + limit;
      const url = `${API_URL}api/spotify/playlists?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!playlists || !items) return <p>loading...</p>;

  const myPlaylists = items.map((playlist) => {
    return (
      <li
        className={"column"}
        key={playlist.id}
        onContextMenu={(e) => handleRightClick(e, playlist.id)}
      >
        <Link to={`/playlist/${playlist.id}`}>
          {playlist.images.length > 0 ? (
            <div
              className={"cover"}
              style={{ backgroundImage: `url(${playlist.images[0].url})` }}
            />
          ) : (
            <CoverPlaceholder className="cover" />
          )}
          <span className={"title"}>{playlist.name}</span>
          <span className={"artists-name"}>by {playlist.owner.display_name}</span>
        </Link>
      </li>
    );
  });

  return (
    <div style={{ overflow: "hidden auto" }}>
      <h2>
        <span>
          My Playlists
          <button className="add-button" onClick={handleCreateNewPlaylist}>
            <span className="material-icons">add</span>
            <span className="text">New Playlist</span>
          </button>
        </span>
      </h2>
      <div className={"overview"} onScroll={onScroll}>
        <ul className={"overview-items"}>{myPlaylists}</ul>
      </div>
    </div>
  );
}
