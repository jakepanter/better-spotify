import React, { useEffect, useState } from "react";
import { CurrentUsersProfileResponse, SavedTrackObject, UsersSavedTracksResponse } from "spotify-types";
import TrackList from "../TrackList/TrackList";

export default function SavedTracks() {
  const [tracks, setTracks] = useState<UsersSavedTracksResponse>();
  const [items, setItems] = useState<SavedTrackObject[]>([]);
  const [user, setUser] = useState<CurrentUsersProfileResponse>();
  const [next, setNext] = useState<string>(
    `${API_URL}api/spotify/me/tracks`
  );
  
  useEffect(() => {
    async function fetchData() {
      const data: CurrentUsersProfileResponse = await fetch(
        `http://localhost:5000/api/spotify/me`
      ).then((res) => res.json());
      setUser(data);
    }
    fetchData();
  }, []);

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

  if (!tracks || !items || user) return <p>loading...</p>;
  console.log(user);
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
          <TrackList type={"saved"} id_tracklist={user.uri} data={items}/>
        </tbody>
      </table>
    </>
  );
}
