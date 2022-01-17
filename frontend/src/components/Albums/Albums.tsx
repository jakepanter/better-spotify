import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersSavedAlbumsResponse, SavedAlbumObject } from "spotify-types";
import { API_URL } from "../../utils/constants";
import "../../cards.scss";
import "./Albums.scss";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";

export default function Albums() {
  const [albums, setAlbums] = useState<UsersSavedAlbumsResponse>();
  const [items, setItems] = useState<SavedAlbumObject[]>([]);
  const [next, setNext] = useState<string>(
    `${API_URL}api/spotify/collections/albums`
  );

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const data: UsersSavedAlbumsResponse = await fetch(url).then((res) =>
      res.json()
    );
    setAlbums(data);
    const arr: SavedAlbumObject[] = [...items, ...data.items];
    setItems(arr);
  }

  //fetch next albums when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
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
      <Link to={`/album/${item.album.id}`}
            className={'Card'}
            key={item.album.id}
      >
        {item.album.images.length > 0 ? (
          <div
            className={"CardCover"}
            style={{ backgroundImage: `url(${item.album.images[0].url}` }}
          />
        ) : (
          <CoverPlaceholder />
        )}
        <span className={"CardTitle"}>{item.album.name}</span>
        <span className={"CardArtist"}>{item.album.artists[0].name}</span>
      </Link>
    );
  });

  return (
    <div className={'Albums'}>
      <h2 className={'Header'}>Albums</h2>
      <div className={'Content'}
           onScroll={onScroll}
      >
        <div className={'CoverList'}>{savedAlbums}</div>
      </div>
    </div>
  );
}
