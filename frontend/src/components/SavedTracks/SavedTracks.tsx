import React, { useEffect, useState } from "react";
import { SavedTrackObject, UsersSavedTracksResponse } from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

export default function SavedTracks() {
  const [tracks, setTracks] = useState<UsersSavedTracksResponse>();
  const [items, setItems] = useState<SavedTrackObject[]>([]);
  const [next, setNext] = useState<string>(
    `${API_URL}api/spotify/me/tracks`
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
      const url = `${API_URL}api/spotify/me/tracks?offset=${offset}&limit=${limit}`;
      setNext(url);
    }
  };

  if (!tracks || !items) return <p>loading...</p>;
  return (
    <>
      <table onScroll={onScroll} style={{display: "block", height: "500px", overflow: "auto" }}>
        <thead>
          <th></th>
          <th>Title</th>
          <th>Artists</th>
          <th>Duration</th>
        </thead>
        <tbody >
          <TrackList type={"saved"} data={items}/>
        </tbody>
      </table>
    </>
  );
}
