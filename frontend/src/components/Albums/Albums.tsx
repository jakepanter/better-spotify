import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UsersSavedAlbumsResponse, SavedAlbumObject } from "spotify-types";
import { API_URL } from "../../utils/constants";
import "./Albums.scss";
import { getAuthHeader } from "../../helpers/api-helpers";
import AppContext from "../../AppContext";
import Card from "../Card/Card";

export default function Albums() {
  const [albums, setAlbums] = useState<UsersSavedAlbumsResponse>();
  const [items, setItems] = useState<SavedAlbumObject[]>([]);
  const [next, setNext] = useState<string>(`${API_URL}api/spotify/collections/albums`);
  const state = useContext(AppContext);
  const history = useHistory()

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

  const goToArtist = (e: any, artistId: string) => {
    e.preventDefault();
    history.push(`/artist/${artistId}`)
  };


  //fetch next albums when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && albums && albums.offset < albums.total) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `${API_URL}api/spotify/collections/albums?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!albums || !items) return <p>loading...</p>;
  const savedAlbums = items.map((item) => {
    return (
      <Card
        key={item.album.id}
        linkTo={`/album/${item.album.id}`}
        item={item.album.id}
        imageUrl={item.album.images[0] !== null ? item.album.images[0].url : ""}
        title={item.album.name}
        subtitle={item.album.artists.map((a) => a.name).join(", ")}
        handleRightClick={handleRightClick}
      />
    );
  });
  //{item.album.artists.map<React.ReactNode>((a) =>
    //             <span onClick={e => goToArtist(e, a.id)} className={"artists-name"} key={a.id}>{a.name}</span>).reduce((a,b)=>[a,', ',b])}

  return (
    <div className={"Albums"}>
      <h2 className={"Header"}>Albums</h2>
      <div className={"Content"} onScroll={onScroll}>
        <div className={"CoverList"}>{savedAlbums}</div>
      </div>
    </div>
  );
}
