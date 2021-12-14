import React, { useEffect, useState } from "react";
import {AlbumObjectFull, AlbumTracksResponse, SingleAlbumResponse, TrackObjectSimplified} from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

// The fetching limit, can be adjusted by changing this value
const limit = 50;

// The album object itself
interface IProps {
  id: string;
}

export default function Album(props: IProps) {
  const { id } = props;
  const [album, setAlbum] = useState<AlbumObjectFull>();
  // The list of tracks of the album
  const [tracks, setTracks] = useState<TrackObjectSimplified[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(limit);

  async function fetchAlbumData() {
    const data: SingleAlbumResponse = await fetch(
      `${API_URL}api/spotify/album/${id}?limit=${limit}`
    ).then((res) => res.json());

    // Save album data and first tracks
    setAlbum(data);
    setTracks((oldTracks) => [...oldTracks, ...data.tracks.items]);
  }

  async function fetchAlbumTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (album && album.tracks && album.tracks.total && album.tracks.total <= offset) return;

    const data: AlbumTracksResponse = await fetch(
      `${API_URL}api/spotify/album/${id}/tracks?offset=${newOffset}&limit=${limit}`
    ).then((res) => res.json());

    // Save new tracks
    setTracks((oldTracks) => [...oldTracks, ...data.items]);
  }

  // Fetch the main album data
  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchAlbumTrackData(offset);
  }, [offset]);

  if (!album) return <p>loading...</p>;

  return (
    <TrackList loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)} type={"album"} tracks={tracks} />
  );
}
