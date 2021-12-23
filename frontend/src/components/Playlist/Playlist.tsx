import React, { useEffect, useState } from "react";
import "./Playlist.scss";
import TrackList from "../TrackList/TrackList";
import {
  CheckUsersSavedTracksResponse,
  PlaylistObjectFull,
  PlaylistTrackObject,
  PlaylistTrackResponse,
  SinglePlaylistResponse,
} from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";

// The fetching limit, can be adjusted by changing this value
const limit = 50;

interface IProps {
  id: string;
  headerStyle: "none" | "compact" | "full";
}

export interface PlaylistTrack extends PlaylistTrackObject {
  is_saved: boolean;
}

export default function Playlist(props: IProps) {
  const { id, headerStyle } = props;

  // The album object itself
  const [playlist, setPlaylist] = useState<PlaylistObjectFull>();
  // The list of tracks of the album
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(0);

  async function fetchPlaylistData() {
    //this only fetches the total number of tracks, cover image and owner of the playlist, not the actual tracks
    const data: SinglePlaylistResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}?fields=tracks(total)&fields=images&fields=owner&fields=name`
    ).then((res) => res.json());

    // Save album data
    setPlaylist(data);
  }

  async function fetchPlaylistTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (
      playlist &&
      playlist.tracks &&
      playlist.tracks.total &&
      playlist.tracks.total <= offset
    )
      return;

    const data: PlaylistTrackResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}/tracks?offset=${newOffset}&limit=${limit}`
    ).then((res) => res.json());

    // Save new tracks
    // Save if tracks are saved
    const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(
      data.items.map((i) => i.track.id)
    );
    const fetchedTracks = data.items as PlaylistTrack[];
    setTracks((oldTracks) => [
      ...oldTracks,
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }),
    ]);
  }

  async function fetchIsSavedData(trackIds: string[]) {
    const data: CheckUsersSavedTracksResponse = await fetch(
      `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`
    ).then((res) => res.json());

    return data;
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
    <div className={"Playlist"}>
      {headerStyle !== "none" ? (
        headerStyle === "compact" ? (
          <div className={"PlaylistHeader PlaylistHeaderCompact"}>
            <h2>{playlist.name}</h2>
          </div>
        ) : (
          <div className={"PlaylistHeader PlaylistHeaderFull"}>
            <div className={"PlaylistHeaderCover"}>
              {playlist.images.length > 0 ? (
                <img src={playlist.images[0].url} alt={"Playlist Cover"} />
              ) : (
                <CoverPlaceholder />
              )}
            </div>
            <div className={"PlaylistHeaderMeta"}>
              <h4>Playlist</h4>
              <h1>{playlist.name}</h1>
              <p>
                by {playlist.owner.display_name} — {playlist.tracks.total} Song
                {playlist.tracks.total === 1 ? "" : "s"}
              </p>
            </div>
            <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
          </div>
        )
      ) : (
        <></>
      )}
      <TrackList
        fullyLoaded={playlist.tracks.total <= tracks.length}
        loadMoreCallback={() =>
          setOffset((currentOffset) => currentOffset + limit)
        }
        type={"playlist"}
        tracks={tracks}
      />
    </div>
  );
}
