import React, {useEffect, useState} from "react";
import {CheckUsersSavedTracksResponse, PlaylistTrackResponse, SavedTrackObject} from "spotify-types";
import {API_URL} from "../../utils/constants";
import { PlaylistTrack } from "../Playlist/Playlist";
import TrackList from "../TrackList/TrackList";

const limit = 50;

interface IProps {
    headerStyle: "none" | "compact" | "full";
}

export default function SavedTracks(props: IProps) {
    const {headerStyle} = props;

    // The list of tracks of the album
    const [tracks, setTracks] = useState<SavedTrackObject[]>([]);
    // The current offset for fetching new tracks
    const [offset, setOffset] = useState<number>(0);
    // Total count of tracks
    const [total, setTotal] = useState<number>(-1);

    async function fetchTrackData(newOffset: number) {
        // Only fetch if there are tracks left to fetch
        if (total >= 0 && total <= offset) return;

        const data: PlaylistTrackResponse = await fetch(
            `${API_URL}api/spotify/me/tracks?offset=${newOffset}&limit=${limit}`
        ).then((res) => res.json());

        const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(
            data.items.map((i) => i.track.id)
        );
        // Save new tracks
        const fetchedTracks = data.items as PlaylistTrack[]
        setTracks((oldTracks) => [
            ...oldTracks,
            ...fetchedTracks.map((t, i) => {
                t.is_saved = saved[i];
                return t;
            }),
        ]);

        if (total < 0) {
            setTotal(data.total);
        }
    }

    async function fetchIsSavedData(trackIds: string[]) {
        const data: CheckUsersSavedTracksResponse = await fetch(
            `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`
          ).then((res) => res.json());
      
          return data;
    }

    // Fetch more album tracks if necessary
    useEffect(() => {
        fetchTrackData(offset);
    }, [offset]);

    if (!tracks) return <p>loading...</p>;

    return (
        <div className={"Playlist"}>
            {headerStyle !== "none" ? (
                headerStyle === "compact" ? (
                    <div className={"PlaylistHeader PlaylistHeaderCompact"}>
                        <h2>Saved Tracks</h2>
                    </div>
                ) : (
                    <div className={"PlaylistHeader PlaylistHeaderFull"}>
                        <div className={"PlaylistHeaderCover"}>
                            <img
                                src={
                                    "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                                }
                                alt={"Saved Tracks"}
                            />
                        </div>
                        <div className={"PlaylistHeaderMeta"}>
                            <h1>Saved Tracks</h1>
                            <p>
                                {total} Song{total === 1 ? "" : "s"}
                            </p>
                        </div>
                        <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
                    </div>
                )
            ) : (
                <></>
            )}
            <TrackList
                fullyLoaded={total <= tracks.length}
                loadMoreCallback={() =>
                    setOffset((currentOffset) => currentOffset + limit)
                }
                type={"saved"}
                tracks={tracks}
                id_tracklist={''}
            />
        </div>
    );
}
