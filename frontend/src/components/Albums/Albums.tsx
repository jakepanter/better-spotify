import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Albums() {
  const [albums, setAlbums]: any = useState();
  const [items, setItems]: any = useState([]);
  const [next, setNext]: any = useState(
    "http://localhost:5000/api/spotify/collections/albums"
  );

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const data = await fetch(url).then((res) => res.json());
    setAlbums(data);
    const arr = [...items, ...data.items];
    setItems(arr);
  }

  //fetch next albums when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      const limit = albums.limit;
      const offset = albums.offset + limit;
      const url = `http://localhost:5000/api/spotify/collections/albums?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!albums || !items) return <p>loading...</p>;
  return (
    <div onScroll={onScroll} style={{ height: "500px", overflowY: "scroll" }}>
      {items.map((item: any) => {
        return (
          <div key={item.album.id}>
            <Link to={`/album/${item.album.id}`}>
              <img src={item.album.images[2].url} alt="" />
              <p>{item.album.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
