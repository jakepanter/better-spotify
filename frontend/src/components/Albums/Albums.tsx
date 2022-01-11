import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersSavedAlbumsResponse, SavedAlbumObject } from "spotify-types";
import { API_URL } from "../../utils/constants";
import "../../cards.scss";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import AppContext from "../../AppContext";

export default function Albums() {
  const [albums, setAlbums] = useState<UsersSavedAlbumsResponse>();
  const [items, setItems] = useState<SavedAlbumObject[]>([]);
  const [next, setNext] = useState<string>(`${API_URL}api/spotify/collections/albums`);
  const state = useContext(AppContext);

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const data: UsersSavedAlbumsResponse = await fetch(url).then((res) => res.json());
    setAlbums(data);
    const arr: SavedAlbumObject[] = [...items, ...data.items];
    setItems(arr);
  }

  const handleRightClick = (e: any, albumId: string) => {
    e.preventDefault();
    //pass clicked playlist to context menu (doesnt contain tracks)
    const album = items.find((item) => item.album.id === albumId)?.album;
    state.setContextMenu({
      ...state.contextMenu,
      type: "albums",
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      data: album,
    });
  };

  //fetch next albums when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && albums) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `${API_URL}api/spotify/collections/albums?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!albums || !items) return <p>loading...</p>;
  const savedAlbums = items.map((item) => {
    return (
      <li
        className={"column"}
        key={item.album.id}
        onContextMenu={(e) => handleRightClick(e, item.album.id)}
      >
        <Link to={`/album/${item.album.id}`}>
          {item.album.images.length > 0 ? (
            <div
              className={"cover"}
              style={{ backgroundImage: `url(${item.album.images[0].url}` }}
            />
          ) : (
            <CoverPlaceholder />
          )}
          <span className={"title"}>{item.album.name}</span>
          <span className={"artists-name"}>{item.album.artists[0].name}</span>
        </Link>
      </li>
    );
  });

  return (
    <div style={{ overflow: "hidden auto" }}>
      <h2>Albums</h2>
      <div className={"overview"} onScroll={onScroll}>
        <ul className={"overview-items"}>{savedAlbums}</ul>
      </div>
    </div>
  );
}
