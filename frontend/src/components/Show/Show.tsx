import React, { useEffect, useState } from "react";
import { EpisodeObject, ShowEpisodesResponse, ShowObjectFull, SingleShowResponse} from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";

// The fetching limit, can be adjusted by changing this value
const limit = 20;

// The show id
interface IProps {
  id: string;
  headerStyle: "none" | "compact" | "full";
}

export interface ShowEpisodes extends EpisodeObject {
    is_saved: boolean;
}

export default function Show(props: IProps) {
    const { id, headerStyle } = props;
    const [show, setShow] = useState<ShowObjectFull>();
    // The list of tracks of the album
    const [episodes, setEpisodes] = useState<ShowEpisodes[]>([]);
    // The current offset for fetching new tracks
    const [offset, setOffset] = useState<number>(limit);

    async function fetchShowData() {
        const data: SingleShowResponse = await fetch(
            `${API_URL}api/spotify/show/${id}`        
        ).then((res) => res.json());

        setShow(data);

        const fetchedEpisodes = data.episodes.items as ShowEpisodes[];
        setEpisodes((oldEpisodes) => [
            ...oldEpisodes,
            ...fetchedEpisodes.map((t) => {
                return t;
            }),
        ]);
    }

    async function fetchShowEpisodeData(newOffset: number) {
        // Only fetch if there are tracks left to fetch
        if (
            show &&
            show.episodes &&
            show.episodes.total &&
            show.episodes.total <= offset
        )
            return;

        const data: ShowEpisodesResponse = await fetch(
            `${API_URL}api/spotify/show/${id}/episodes?offset=${newOffset}&limit=${limit}`
        ).then((res) => res.json());

        const fetchedEpisodes = data.items as ShowEpisodes[]
        setEpisodes((oldEpisodes) => [
            ...oldEpisodes,
            ...fetchedEpisodes.map((t) => {
                return t;
            }),
        ]);    
    }
    
    useEffect(() => {
        fetchShowData();
    }, [id]);

    useEffect(() => {
        fetchShowEpisodeData(offset);
    }, [offset]);

    if(!show) return <p>loading...</p>;

    return <div className={"Playlist"}>
        {headerStyle !== "none" ? (
        headerStyle === "compact" ? (
          <div className={"PlaylistHeader PlaylistHeaderCompact"}>
            <h2>
              {show.publisher} — {show.name}
            </h2>
          </div>
        ) : (
          <div className={"PlaylistHeader PlaylistHeaderFull"}>
            <div className={"PlaylistHeaderCover"}>
              {show.images !== undefined ? (
                <img src={show.images[1].url} alt={"Album Cover"} />
              ) : (
                <CoverPlaceholder/>
              )}
            </div>
            <div className={"PlaylistHeaderMeta"}>
              <h4>Podcast</h4>
              <h1>{show.name}</h1>
              <p>
                by {show.publisher} —{" "}
                {show.episodes.total} Episode{show.episodes.total === 1 ? "" : "s"}
              </p>
            </div>
            <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
          </div>
        )
      ) : (
        <></>
      )}
        <TrackList
            fullyLoaded={show.episodes.total <= episodes.length}
            loadMoreCallback={() =>
                setOffset((currentOffset) => currentOffset + limit)
            }
            type={"show"}
            tracks={episodes}
            id_tracklist={show.id}
        />
    </div>
}
