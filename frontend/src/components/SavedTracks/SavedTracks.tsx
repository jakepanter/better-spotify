import React, { useEffect, useState } from "react";
import {
  PlaylistTrackResponse,
  SavedTrackObject
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

const limit = 50;

export default function SavedTracks() {
  // The list of tracks of the album
  const [tracks, setTracks] = useState<SavedTrackObject[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(0);
  // Total count of tracks
  const [total, setTotal] = useState<number>(-1);

  async function fetchTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (total >= 0 && total <= offset) return;

    const data: PlaylistTrackResponse = await fetch(
      `${API_URL}api/spotify/me/tracks?offset=${newOffset}&limit=${limit}`
    ).then((res) => res.json());

    // Save new tracks
    setTracks((oldTracks) => [...oldTracks, ...data.items]);

    if (total < 0) {
      setTotal(data.total);
    }
  }

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchTrackData(offset);
  }, [offset]);

  if (!tracks) return <p>loading...</p>;

  return (
    <TrackList loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)} type={"saved"} tracks={tracks} />
  );
}
