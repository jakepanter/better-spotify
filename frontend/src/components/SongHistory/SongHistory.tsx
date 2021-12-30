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
        console.log(recentPlayedTracksData)
        // Save to state
        setRecentTracks((oldTracks) => [...oldTracks, ...recentPlayedTracksData.items]);

        // extract
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

    // Fetch the main ..... data
    useEffect(() => {
        fetchRecentTracksData(beforeTimestamp);
    }, [limitNumber]);

    if (!recentTracks) return <p>loading...</p>;

    //TODO
    // fullyLoaded
    return (
        <TrackList fullyLoaded={beforeTimestamp === -1} loadMoreCallback={() => setLimitNumber(limitNumber + 1)} type={"songhistory"} tracks={recentTracks} id_tracklist={''}/>
    );
}