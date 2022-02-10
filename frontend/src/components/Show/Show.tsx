import React, { useEffect, useState } from "react";
import { EpisodeObject, ShowEpisodesResponse, ShowObjectFull, SingleShowResponse} from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from '../../helpers/api-helpers';
import "./Show.scss";

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
    // The list of episodes of the Show
    const [episodes, setEpisodes] = useState<ShowEpisodes[]>([]);
    // The current offset for fetching new episodes
    const [offset, setOffset] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>();

    async function fetchShowData() {
        const authHeader = getAuthHeader();
        const data: SingleShowResponse = await fetch(
            `${API_URL}api/spotify/show/${id}`, {
                headers: {
                    'Authorization': authHeader
                }
            }).then((res) => res.json());

        setShow(data);

        const showLiked: boolean[] = await isShowSavedData(
          [data.id]
        );
        setLiked(showLiked[0]);

        const fetchedEpisodes = data.episodes.items as ShowEpisodes[];
        setEpisodes((oldEpisodes) => [
            ...oldEpisodes,
            ...fetchedEpisodes.map((t) => {
                return t;
            }),
        ]);
    }

    async function fetchShowEpisodeData(newOffset: number) {
        const authHeader = getAuthHeader();
        // Only fetch if there are episodes left to fetch
        if (
            show &&
            show.episodes &&
            show.episodes.total &&
            show.episodes.total <= newOffset
        )
            return;

        const data: ShowEpisodesResponse = await fetch(
            `${API_URL}api/spotify/show/${id}/episodes?offset=${newOffset}&limit=${limit}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        const fetchedEpisodes = data.items as ShowEpisodes[];
        setEpisodes((oldEpisodes) => [
            ...oldEpisodes,
            ...fetchedEpisodes.map((t) => {
                return t;
            }),
        ]);    
    }

    async function isShowSavedData(showIds: string[]) {
      const authHeader = getAuthHeader();
      const data: boolean[] = await fetch(
        `${API_URL}api/spotify/me/shows/contains?showIds=${showIds}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      ).then((res) => res.json());
  
      return data;
    }

    const handleLikeButton = async () => {
      if(show !== undefined) {
        if (!liked) {
          // add
          const authHeader = getAuthHeader();
          await fetch(`${API_URL}api/spotify/me/shows/add?showIds=${show.id}`, {
            headers: {
              Authorization: authHeader,
            },
          }).then((res) => res.json());
          setLiked(true);
        } else {
          // remove
          const authHeader = getAuthHeader();
          await fetch(`${API_URL}api/spotify/me/shows/remove?showIds=${show.id}`, {
            headers: {
              Authorization: authHeader,
            },
          }).then((res) => res.json());
          setLiked(false);
        }
      } 
    };
    
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
            <div className={"PlaylistHeaderFilter showsLikeOption"}>
              <button className={`button checkbox ${liked ? "checked" : ""}`} onClick={handleLikeButton}>
                <span className={"material-icons"}>{liked ? "favorite" : "favorite_border"}</span>
                  <br />
                <p>Add to Collection</p>
              </button>
            </div>
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
