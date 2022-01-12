import React, {useEffect, useState} from "react";
import {
    PlayHistoryObject, UsersRecentlyPlayedTracksResponse
} from "spotify-types";
import TrackList from "../TrackList/TrackList";

import {API_URL} from '../../utils/constants';

// The fetching limit, can be adjusted by changing this value
const defaultLimit = 20;

export default function SongHistory() {
// The album object itself
    const [recentTracks, setRecentTracks] = useState<PlayHistoryObject[]>([]);
    const [limitNumber, setLimitNumber] = useState<number>(0);
    const [beforeTimestamp, setBeforeTimestamp] = useState<Number>(Date.now());


    async function fetchRecentTracksData(before: Number) {
        if(beforeTimestamp === -1) return;

        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?before=${before}&limit=${defaultLimit}`
        ).then((res) => res.json());
        // Save to state
        setRecentTracks((playedTracks) => [...playedTracks, ...recentPlayedTracksData.items]);

        // extract next and set as before timestamp
        // when the scroller is on bottom we want to fetch more recently played tracks,
        // therefore the timestamp for the before parameter must be set
        // the next property contains the before value
        if (recentPlayedTracksData.next !== null) {
            const next: any = recentPlayedTracksData.next;
            const re = new RegExp('(?<==).+?(?=&)');
            setBeforeTimestamp(next.match(re)[0] as Number);
        }
        // if next is null, no more data should be fetched, therefor beforeTimestamp is set to the value -1
        else{
            setBeforeTimestamp(-1);
        }
    }

    // Fetch data when limitNumber changes
    useEffect(() => {
        fetchRecentTracksData(beforeTimestamp);
    }, [limitNumber]);

    if (!recentTracks) return <p>loading...</p>;


    return (
        <TrackList fullyLoaded={beforeTimestamp === -1} loadMoreCallback={() => setLimitNumber(limitNumber + 1)} type={"songhistory"} tracks={recentTracks} id_tracklist={''}/>
    );
}