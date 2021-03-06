import React, {useEffect, useState} from "react";
import TagsSystem from "../../utils/tags-system";
import {API_URL} from "../../utils/constants";
import {CheckUsersSavedTracksResponse, MultipleTracksResponse, TrackObjectFull} from "spotify-types";
import TrackList from "../TrackList/TrackList";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { getAuthHeader } from '../../helpers/api-helpers';
import { Link } from "react-router-dom";

interface IProps {
  id: string;
  headerStyle: "none" | "compact" | "full";
}

export interface TagsTrack extends TrackObjectFull {
  is_saved: boolean;
}

const limit = 50;

function TagTracklist(props: IProps) {
  const { id, headerStyle } = props;
  const trackIds = TagsSystem.getElementsForTag(id);
  const tagData = TagsSystem.getTagById(id);

  const [tracks, setTracks] = useState<TagsTrack[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(-50);

  async function fetchTracks() {
    const ids = trackIds.slice(offset, offset + limit);

    if (ids.length <= 0) return;

    const authHeader = getAuthHeader();
    const data: MultipleTracksResponse = await fetch(
      `${API_URL}api/spotify/tracks?trackIds=${ids}`, {
          headers: {
            'Authorization': authHeader
          }
        }
    ).then((res) => res.json());

    const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(
      data.tracks.map((i) => i.id)
    );

    const fetchedTracks = data.tracks as TagsTrack[];

    setTracks((oldTracks) => [
      ...oldTracks,
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }) as TagsTrack[],
    ]);
  }

  async function fetchIsSavedData(trackIds: string[]) {
    const authHeader = getAuthHeader();
    const data: CheckUsersSavedTracksResponse = await fetch(
      `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`, {
          headers: {
            'Authorization': authHeader
          }
        }
    ).then((res) => res.json());

    return data;
  }

  useEffect(() => {
    setTracks([]);
    setOffset(0);

    if (offset === 0) {
      setTimeout(() => fetchTracks(), 0);
    }
  }, [id]);

  useEffect(() => {
    fetchTracks();
  }, [offset]);

  return (
    <div className={"Playlist"}>
      {headerStyle !== "none" ? (
        headerStyle === "compact" ? (
          <div className={"PlaylistHeader PlaylistHeaderCompact"}>
            <Link to={'/tag/' + id} className={"PlaylistHeaderLink"}><h2>{tagData.title}</h2></Link>
          </div>
        ) : (
          <div className={"PlaylistHeader PlaylistHeaderFull"}>
            <div className={"PlaylistHeaderCover"}>
              <CoverPlaceholder/>
            </div>
            <div className={"PlaylistHeaderMeta"}>
              <h4>Tag</h4>
              <h1>{tagData.title}</h1>
            </div>
            <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
          </div>
        )
      ) : (
        <></>
      )}
      <TrackList
        type={'tags'}
        tracks={tracks}
        loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)}
        fullyLoaded={trackIds.length <= tracks.length}
        id_tracklist={''}
        hideTag={id}/>
    </div>
  );
}

export default TagTracklist;
