import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "../../AppContext";
import "../../cards.scss";
import {
  CreatePlaylistResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from "../../utils/constants";
import { createNewPlaylist } from "../../helpers/api-helpers";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

export default function Playlists() {
  const [playlists, setPlaylists] = useState<ListOfUsersPlaylistsResponse>();
  const [items, setItems] = useState<PlaylistObjectSimplified[]>([]);
  const [next, setNext] = useState<string>(`${API_URL}api/spotify/playlists`);
  const state = useContext(AppContext);
  const location = useLocation<any>();

  useEffect(() => {
    fetchData(next);
  }, [next]);

  useEffect(() => {
    // remove unfollowed playlist from items
    if (location.state && location.state.unfollowed) {
      const unfollowedPlaylistId = location.state.unfollowed;
      setItems(items.filter((list) => list.id !== unfollowedPlaylistId));
    }
  }, [location]);

  async function fetchData(url: string) {
    const authHeader = getAuthHeader();
    const data: ListOfUsersPlaylistsResponse = await fetch(url, {
      headers: { Authorization: authHeader },
    }).then((res) => res.json());
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
    if (bottom && playlists && playlists.offset < playlists.total) {
      const limit = playlists.limit;
      const offset = playlists.offset + limit;
      const url = `${API_URL}api/spotify/playlists?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!playlists || !items) return <p>loading...</p>;

  const myPlaylists = items.map((playlist) => {
    return (
      <Card
        key={playlist.id}
        linkTo={`/playlist/${playlist.id}`}
        item={playlist.id}
        imageUrl={playlist.images[0] !== null ? playlist.images[0].url : ""}
        title={playlist.name}
        subtitle={playlist.owner.display_name}
        handleRightClick={handleRightClick}
      />
    );
  });

  return (
    <div className={"Playlists"}>
      <h2 className={"Header"}>
        Playlists
        <button className="add-button" onClick={handleCreateNewPlaylist}>
          <span className="material-icons">add</span>
          <span className="text">New Playlist</span>
        </button>
      </h2>
      <div className={"Content"} onScroll={onScroll}>
        <div className={"CoverList"}>{myPlaylists}</div>
      </div>
    </div>
  );
}
