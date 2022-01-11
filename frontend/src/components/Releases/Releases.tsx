import React, { useEffect, useState } from "react";
import {
    ListOfNewReleasesResponse,
    AlbumObjectSimplified
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

const limit = 20;

export default function Releases() {
    // The list of tracks of the album
    const [tracks, setTracks] = useState<AlbumObjectSimplified[]>([]);
    // The current offset for fetching new tracks
    const [offset, setOffset] = useState<number>(0);
    // Total count of tracks
    const [total, setTotal] = useState<number>(-1);

    async function fetchTrackData(newOffset: number) {
        // Only fetch if there are tracks left to fetch
        if (total >= 0 && total <= offset) return;

        const data: ListOfNewReleasesResponse = await fetch(
            `${API_URL}api/spotify/browse/new-releases?offset=${newOffset}&limit=${limit}`
        ).then((res) => res.json());
        console.log(data)
        // Save new tracks
        setTracks((oldTracks) => [...oldTracks, ...data.albums.items]);

        if (total < 0) {
            setTotal(data.albums.total);
        }
    }

    // Fetch more album tracks if necessary
    useEffect(() => {
        fetchTrackData(offset);
    }, [offset]);

    if (!tracks) return <p>loading...</p>;

    return (
        <TrackList fullyLoaded={total <= tracks.length} loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)} type={"releases"} tracks={tracks} id_tracklist={''} />
    );
}
