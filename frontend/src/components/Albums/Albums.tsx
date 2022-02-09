import React, { useContext, useEffect, useState } from "react";
import { UsersSavedAlbumsResponse, SavedAlbumObject } from "spotify-types";
import { API_URL } from "../../utils/constants";
import "./Albums.scss";
import { getAuthHeader } from "../../helpers/api-helpers";
import AppContext from "../../AppContext";
import Card from "../Card/Card";
import { Link } from "react-router-dom";

export default function Albums() {
  const [albums, setAlbums] = useState<UsersSavedAlbumsResponse>();
  const [items, setItems] = useState<SavedAlbumObject[]>([]);
  const [next, setNext] = useState<string>(`${API_URL}api/spotify/collections/albums`);
  const state = useContext(AppContext);

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const authHeader = getAuthHeader();
    const data: UsersSavedAlbumsResponse = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    }).then((res) => res.json());
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
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 2;
    if (bottom && albums && albums.offset < albums.total) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `${API_URL}api/spotify/collections/albums?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  const savedAlbums =
    !albums || !items ? (
      <p>loading...</p>
    ) : (
      items.map((item) => {
        return (
          <Card
            key={item.album.id}
            linkTo={`/album/${item.album.id}`}
            item={item.album.id}
            imageUrl={item.album.images.length > 0 ? item.album.images[0].url : ""}
            title={item.album.name}
            subtitle={item.album.artists}
            handleRightClick={handleRightClick}
          />
        );
      })
    );

  return (
    <div className={"Albums"}>
      <h2 className={"Header"}><Link to={'/collections/albums'} className={"AlbumsLink"}>Albums</Link></h2>
      <div className={"Content"} onScroll={onScroll}>
        <div className={"CoverList"}>{savedAlbums}</div>
      </div>
    </div>
  );
}
