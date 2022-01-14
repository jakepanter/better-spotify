import React, {useEffect, useState} from "react";
import {
    CheckUsersSavedTracksResponse,
    PlayHistoryObject, UsersRecentlyPlayedTracksResponse
} from "spotify-types";
import TrackList from "../TrackList/TrackList";

import {API_URL} from '../../utils/constants';

// The fetching limit, can be adjusted by changing this value
const defaultLimit = 20;

export interface SongHistoryTrack extends PlayHistoryObject {
    is_saved: boolean;
}

export default function SongHistory() {
    // The list of recently played tracks
    const [recentPlayedTracks, setRecentlyPlayedTracks] = useState<SongHistoryTrack[]>([]);
    // The limit for triggering the useEffect, every time the limitNumber changes new recently played tracks are fetched
    const [limitNumber, setLimitNumber] = useState<number>(0);
    // The before-timestamp for fetching tracks played before a specific timestamp; functions similar to an offset
    const [beforeTimestamp, setBeforeTimestamp] = useState<Number>(Date.now());


    async function fetchRecentTracksData(before: Number) {
        if(beforeTimestamp === Number(-1)) return;

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

        // extract next and set as before timestamp
        // when the scroller is on bottom we want to fetch more recently played tracks,
        // therefore the timestamp for the before parameter must be set
        // the next property contains the before value
        if (recentPlayedTracksData.next!==null) {
            const next: any = recentPlayedTracksData.next;
            const re = new RegExp('(?<==).+?(?=&)');
            setBeforeTimestamp(next.match(re)[0] as Number);
        } else {
            // TODO: find reason why else is skipped and beforeTimestamp is not set correctly
            // if next is null, no more data should be fetched, therefor beforeTimestamp is set to the value -1
            setBeforeTimestamp(-1);
        }
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
    }, [limitNumber]);

    if (!recentPlayedTracks) return <p>loading...</p>;


    return (
        <TrackList fullyLoaded={beforeTimestamp === -1} loadMoreCallback={() => setLimitNumber(limitNumber + 1)} type={"songhistory"} tracks={recentPlayedTracks} id_tracklist={''}/>
    );
}