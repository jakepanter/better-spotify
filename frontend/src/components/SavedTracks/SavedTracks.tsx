import React, { useEffect, useState } from "react";
import { SavedTrackObject, UsersSavedTracksResponse } from "spotify-types";

export default function SavedTracks() {
  const [tracks, setTracks] = useState<UsersSavedTracksResponse>();
  const [items, setItems] = useState<SavedTrackObject[]>([]);
  const [next, setNext] = useState<string>(
    "http://localhost:5000/api/spotify/me/tracks"
  );

  useEffect(() => {
    fetchData(next);
  }, [next]);

  async function fetchData(url: string) {
    const data: UsersSavedTracksResponse = await fetch(url).then((res) =>
      res.json()
    );
    setTracks(data);
    const arr: SavedTrackObject[] = [...items, ...data.items];
    setItems(arr);
  }

  //fetch next track when you reach the bottom of the current list
  const onScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && tracks) {
      const limit = tracks.limit;
      const offset = tracks.offset + limit;
      const url = `http://localhost:5000/api/spotify/me/tracks?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!tracks || !items) return <p>loading...</p>;
  return (
    <div onScroll={onScroll} style={{ height: "500px", overflow: "scroll" }}>
      {items.map((item) => {
        return (
          <div key={item.track.id}>
            <img src={item.track.album.images[0].url} alt="" width={64} />
            <p>{item.track.name}</p>
          </div>
        );
      })}
    </div>
  );
}
