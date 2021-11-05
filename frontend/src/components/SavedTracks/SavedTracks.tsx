import React, { useEffect, useState } from "react";

export default function SavedTracks() {
  const [tracks, setTracks]: any = useState();
  const [items, setItems]: any = useState([]);
  const [next, setNext]: any = useState(
    "http://localhost:5000/api/spotify/me/tracks"
  );

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const data = await fetch(url).then((res) => res.json());
    setTracks(data);
    const arr = [...items, ...data.items];
    setItems(arr);
  }

  //fetch next track when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      const limit = tracks.limit;
      const offset = tracks.offset + limit;
      const url = `http://localhost:5000/api/spotify/me/tracks?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!tracks|| !items) return <p>loading...</p>;
  console.log("bin hier");
  return (
    <div onScroll={onScroll} style={{ height: "500px", overflow: "scroll" }}>
      {items.map((item: any) => {
        return (
          <div key={item.id}>
              <p>{item.name}</p> 
          </div>
        );
      })}
    </div>
  );
}