import React, {useEffect, useState} from "react";
import {
    CheckUsersSavedTracksResponse,
    PlayHistoryObject, UsersRecentlyPlayedTracksResponse
} from "spotify-types";
import TrackList from "../TrackList/TrackList";

import {API_URL} from '../../utils/constants';

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
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?before=${before}&limit=${defaultLimit}`
        ).then((res) => res.json());

        // Save whether tracks are saved or not
        const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(
            recentPlayedTracksData.items.map((i) => i.track.id)
        );
        // Save recently played tracks as SongHistoryTrack-objects
        const fetchedTracks = recentPlayedTracksData.items as SongHistoryTrack[];
        setRecentlyPlayedTracks((oldTracks) => [
            ...oldTracks,
            // Check if track is saved or not and set is_saved-property
            ...fetchedTracks.map((t, i) => {
                t.is_saved = saved[i];
                return t;
            }),
        ]);
    }

    async function fetchIsSavedData(trackIds: string[]){
        const data: CheckUsersSavedTracksResponse = await fetch(
            `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`
        ).then((res) => res.json());
        return data;
    }
    // Fetch data when limitNumber changes
    useEffect(() => {
        fetchRecentTracksData(beforeTimestamp);
    } ,[beforeTimestamp] );

    if (!recentPlayedTracks) return <p>loading...</p>;


    return (
        <TrackList fullyLoaded={true} loadMoreCallback={() => {}} type={"songhistory"} tracks={recentPlayedTracks} id_tracklist={''}/>
    );
}