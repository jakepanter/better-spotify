import React, { useEffect, useState } from "react";
import {
    ListOfNewReleasesResponse,
    AlbumObjectSimplified
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

const limit = 20;
//TODO
// Filter vor available country?
export default function Releases() {
    // The list of tracks of the album
    const [tracks, setTracks] = useState<AlbumObjectSimplified[]>([]);
    // The current offset for fetching new tracks
    const [offset, setOffset] = useState<number>(0);

    async function fetchTrackData(newOffset: number) {
        const data: ListOfNewReleasesResponse = await fetch(
            `${API_URL}api/spotify/browse/new-releases?offset=${newOffset}&limit=${limit}`
        ).then((res) => res.json());

        // Save new tracks
        setTracks((oldTracks) => [...oldTracks, ...data.albums.items]);
    }

    // Fetch more album tracks if necessary
    useEffect(() => {
        fetchTrackData(offset);
    }, [offset]);

    if (!tracks) return <p>loading...</p>;

    return (
        <TrackList loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)} type={"releases"} tracks={tracks} />
    );
}
