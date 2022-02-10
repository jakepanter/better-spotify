import React, { useEffect, useState } from "react";
import {
  CheckUsersSavedTracksResponse,
  PlayHistoryObject,
  UsersRecentlyPlayedTracksResponse,
} from "spotify-types";
import TrackList from "../TrackList/TrackList";
import { API_URL } from "../../utils/constants";
import { getAuthHeader } from "../../helpers/api-helpers";
import "./SongHistory.scss";

// The fetching limit, can be adjusted by changing this value
const defaultLimit = 50;

export interface SongHistoryTrack extends PlayHistoryObject {
  is_saved: boolean;
}

export default function SongHistory() {
  // The list of recently played tracks
  const [recentPlayedTracks, setRecentlyPlayedTracks] = useState<SongHistoryTrack[]>([]);
  // The before-timestamp for fetching tracks played before a specific timestamp; functions similar to an offset
  const [beforeTimestamp] = useState<Number>(Date.now());

  async function fetchRecentTracksData(before: Number) {
    // Fetch recently played tracks
    const authHeader = getAuthHeader();
    const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
      `${API_URL}api/spotify/player/recently-played?before=${before}&limit=${defaultLimit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    // Save whether tracks are saved or not
    let saved: CheckUsersSavedTracksResponse;
    const recentPlayedTracksIds = recentPlayedTracksData.items.map((i) => i.track.id)
    if(recentPlayedTracksIds.length !== 0){
      saved = await fetchIsSavedData(
        recentPlayedTracksIds
      );
    }
    
    // Save recently played tracks as SongHistoryTrack-objects
    const fetchedTracks = recentPlayedTracksData.items as SongHistoryTrack[];

    // Credit for removing duplicates: https://dev.to/coachmatt_io/comment/8hdm
    const seen = new Set();
    const arr = [
      ...recentPlayedTracks,
      // Check if track is saved or not and set is_saved-property
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }),
    ];
    const filteredArr = arr.filter((el) => {
      const duplicate = seen.has(el.track.id);
      seen.add(el.track.id);
      return !duplicate;
    });

    setRecentlyPlayedTracks(filteredArr);
  }

  async function fetchIsSavedData(trackIds: string[]) {
    const authHeader = getAuthHeader();
    const data: CheckUsersSavedTracksResponse = await fetch(
      `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    return data;
  }
  // Fetch data when limitNumber changes
  useEffect(() => {
    fetchRecentTracksData(beforeTimestamp);
  }, [beforeTimestamp]);

  if (!recentPlayedTracks) return <p>loading...</p>;

  return (
    <>
      <div className="SongHistory">
        <h2 className="Header">Song History</h2>
        <div style={{ margin: "1rem", overflow: "hidden" }}>
          <TrackList
            fullyLoaded={true}
            loadMoreCallback={() => {}}
            type={"songhistory"}
            tracks={recentPlayedTracks}
            id_tracklist={""}
          />
        </div>
      </div>
    </>
  );
}
