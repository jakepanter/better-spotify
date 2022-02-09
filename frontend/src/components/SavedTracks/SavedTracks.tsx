import React, {useEffect, useState} from "react";
import {PlaylistTrackResponse, SavedTrackObject} from "spotify-types";
import {API_URL} from "../../utils/constants";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from '../../helpers/api-helpers';
import { Link } from "react-router-dom";

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

        const authHeader = getAuthHeader();
        const data: PlaylistTrackResponse = await fetch(
            `${API_URL}api/spotify/me/tracks?offset=${newOffset}&limit=${limit}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());

        // Save new tracks
        setTracks((oldTracks) => [...oldTracks, ...data.items]);

        if (total < 0) {
            setTotal(data.total);
        }
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
                        <Link to={'/me/tracks'} className={"PlaylistHeaderLink"}><h2>Liked songs</h2></Link>
                    </div>
                ) : (
                    <div className={"PlaylistHeader PlaylistHeaderFull"}>
                        <div className={"PlaylistHeaderCover"}>
                            <img
                                src={
                                    "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                                }
                                alt={"Liked songs"}
                            />
                        </div>
                        <div className={"PlaylistHeaderMeta"}>
                            <h1>Liked songs</h1>
                            <p>
                                {total < 0 ? "" : total} Song{total === 1 ? "" : "s"}
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
