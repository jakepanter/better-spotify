import React, { useEffect, useState } from "react";
import "./Playlist.scss";
import TrackList from "../TrackList/TrackList";
import { PlaylistObjectFull, PlaylistTrackObject, PlaylistTrackResponse, SinglePlaylistResponse } from "spotify-types";
import { API_URL } from '../../utils/constants';

// The fetching limit, can be adjusted by changing this value
const limit = 50;

interface IProps {
  id: string;
}

export default function Playlist(props: IProps) {
  const { id } = props;

  // The album object itself
  const [playlist, setPlaylist] = useState<PlaylistObjectFull>();
  // The list of tracks of the album
  const [tracks, setTracks] = useState<PlaylistTrackObject[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(limit);

  async function fetchPlaylistData() {
    const data: SinglePlaylistResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}?limit=${limit}`
    ).then((res) => res.json());

    // Save album data and first tracks
    setPlaylist(data);
    setTracks((oldTracks) => [...oldTracks, ...data.tracks.items]);
  }

  async function fetchPlaylistTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (playlist && playlist.tracks && playlist.tracks.total && playlist.tracks.total <= offset) return;

    const data: PlaylistTrackResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}/tracks?offset=${newOffset}&limit=${limit}`
    ).then((res) => res.json());

    // Save new tracks
    setTracks((oldTracks) => [...oldTracks, ...data.items]);
  }

  // Fetch the main album data
  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchPlaylistTrackData(offset);
  }, [offset]);

  if (!playlist) return <p>loading...</p>;

  return (
    <TrackList loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)} type={"playlist"} tracks={tracks} />
  );
}
