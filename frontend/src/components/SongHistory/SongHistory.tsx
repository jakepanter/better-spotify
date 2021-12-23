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
    const [beforeTimestamp, setBeforeTimestamp] = useState<Number>(1640132271077);

    async function fetchRecentTracksData(before: Number) {
        if (limitNumber > 2) return;
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?before=${before}&limit=${defaultLimit}`
        ).then((res) => res.json());
        // Save to state
        setRecentTracks((oldTracks) => [...oldTracks, ...recentPlayedTracksData.items]);
        if (recentPlayedTracksData.next !== null) {
            const next: any = recentPlayedTracksData.next;
            const re = new RegExp('(?<==).+?(?=&)');
            setBeforeTimestamp(next.match(re)[0] as Number);
        }
    }

    // Fetch the main ..... data
    useEffect(() => {
        fetchRecentTracksData(beforeTimestamp);
    }, [limitNumber]);

    if (!recentTracks) return <p>loading...</p>;

    return (
        <TrackList loadMoreCallback={() => setLimitNumber(limitNumber + 1)} type={"songhistory"} tracks={recentTracks}/>
    );
}