import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersSavedAlbumsResponse, SavedAlbumObject } from "spotify-types";
import { API_URL } from '../../utils/constants';
import "./Albums.scss";

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
  return (
      <div className={"overview"} >
        <h2>Albums</h2>
        <ul className={"overview-items"} onScroll={onScroll}>{items.map((item) => {
          return (
              <li className={"column"} key={item.album.id}>
                <Link to={`/album/${item.album.id}`} >
                  <div className={"cover"} style={{backgroundImage: `url(${item.album.images[0].url}`}}>
                  </div>
                  <span className={"title"}>{item.album.name}</span>
                  <span className={"artists-name"}>{item.album.artists[0].name}</span>
                </Link>
              </li>
          );
        })}
        </ul>
      </div>
  );
}

