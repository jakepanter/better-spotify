import React, { useContext, useEffect, useState } from "react";
import "./Playlist.scss";
import TrackList from "../TrackList/TrackList";
import {
  CheckUsersSavedTracksResponse,
  CurrentUsersProfileResponse,
  PlaylistObjectFull,
  PlaylistTrackObject,
  PlaylistTrackResponse,
  SinglePlaylistResponse,
} from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import AppContext from "../../AppContext";
import { Link, useLocation } from "react-router-dom";
import { getAuthHeader } from "../../helpers/api-helpers";
import useSWR from "swr";

// The fetching limit, can be adjusted by changing this value
const limit = 50;

interface IProps {
  id: string;
  headerStyle: "none" | "compact" | "full";
}

export interface PlaylistTrack extends PlaylistTrackObject {
  is_saved: boolean;
}

export default function Playlist(props: IProps) {
  const { id, headerStyle } = props;

  // The album object itself
  const [playlist, setPlaylist] = useState<PlaylistObjectFull>();
  const [title, setTitle] = useState("");
  // The list of tracks of the album
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(0);
  const state = useContext(AppContext);
  const location = useLocation<any>();

  const authHeader = getAuthHeader();
  const fetcher = (url: any) =>
    fetch(url, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());
  const { data: me, error: meError } = useSWR<CurrentUsersProfileResponse>(
    `${API_URL}api/spotify/me`,
    fetcher
  );

  async function fetchPlaylistData() {
    //this only fetches the total number of tracks, cover image and owner of the playlist, not the actual tracks
    const authHeader = getAuthHeader();
    //this only fetches metadata of the playlist not the actual tracks
    const data: SinglePlaylistResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}?fields=tracks(total)&fields=images&fields=owner&fields=name&fields=description&fields=id`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    // Save album data
    setPlaylist(data);
    setTitle(data.name);
  }

  async function fetchPlaylistTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (!playlist) return;
    if (playlist && playlist.tracks && playlist.tracks.total && playlist.tracks.total <= newOffset)
      return;

    const authHeader = getAuthHeader();
    const data: PlaylistTrackResponse = await fetch(
      `${API_URL}api/spotify/playlist/${id}/tracks?offset=${newOffset}&limit=${limit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    // Save new tracks
    // Save if tracks are saved
    let saved: CheckUsersSavedTracksResponse = [];
    const playlistTracksIds = data.items.map((i) => i.track.id)
    if (playlistTracksIds.length !== 0) {
      // Save whether tracks are saved or not
      saved = await fetchIsSavedData(playlistTracksIds);
    }
    const fetchedTracks = data.items as PlaylistTrack[];
    setTracks((oldTracks) => [
      ...oldTracks,
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }),
    ]);
  }

  async function fetchIsSavedData(trackIds: string[]) {
    const authHeader = getAuthHeader();
    const data: CheckUsersSavedTracksResponse = await fetch(
      `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    return data;
  }

  const openMenu = (e: any) => {
    //not working fully because 'tracks' initially only contains the first 50 tracks of a playlist
    state.setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      type: "playlist",
      data: playlist,
    });
  };

  // Fetch the main album data
  useEffect(() => {
    setTracks([]);
    fetchPlaylistData();
  }, [id]);

  useEffect(() => {
    if (tracks.length === 0) fetchPlaylistTrackData(0);
  }, [playlist]);

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchPlaylistTrackData(offset);
  }, [offset]);

  useEffect(() => {
    if (location.state && location.state.removed) {
      // remove removed tracks from items
      const removedIDs: number[] = location.state.removed.map((track: any) => track.positions[0]);
      setTracks(tracks.filter((item, index) => !removedIDs.includes(index)));
    } else if (location.state && location.state.edited) {
      // display changes after editing playlist
      fetchPlaylistData();
    }
  }, [location]);

  const handleKeyUp = (e: any) => {
    //lose focus on enter
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const changeTitle = (e: any) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const updateTitle = async () => {
    if (title === "" && playlist) {
      setTitle(playlist.name);
    } else {
      if (title !== playlist?.name) {
        const authHeader = getAuthHeader();
        await fetch(`${API_URL}api/spotify/playlist/${playlist?.id}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ name: title }),
        });
        fetchPlaylistData();
      }
    }
  };

  if (meError) return <p>error</p>;
  if (!playlist || !me) return <p>loading...</p>;

  return (
    <div className={"Playlist"}>
      {headerStyle !== "none" ? (
        headerStyle === "compact" ? (
          <div className={"PlaylistHeader PlaylistHeaderCompact"}>
            <Link to={'/playlist/' + id} className={"PlaylistHeaderLink"}><h2>{playlist.name}</h2></Link>
          </div>
        ) : (
          <div className={"PlaylistHeader PlaylistHeaderFull"}>
            <div className={"PlaylistHeaderCover"}>
              {playlist.images.length > 0 ? (
                <img src={playlist.images[0].url} alt={"Playlist Cover"} />
              ) : (
                <CoverPlaceholder />
              )}
            </div>
            <div className={"PlaylistHeaderMeta"}>
              <h4>Playlist</h4>
              <h1>
                <input
                  readOnly={playlist.owner.id !== me.id}
                  type="text"
                  maxLength={50}
                  min={1}
                  value={title}
                  onChange={changeTitle}
                  onBlur={updateTitle}
                  onKeyDown={handleKeyUp}
                />
              </h1>
              <p>
                by {playlist.owner.display_name} — {playlist.tracks.total} Song
                {playlist.tracks.total === 1 ? "" : "s"}
              </p>
            </div>
            <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
            <button className="more-button">
              <span className="material-icons minimize-icon" title={"More"} onClick={openMenu}>
                more_horiz
              </span>
            </button>
          </div>
        )
      ) : (
        <></>
      )}
      <TrackList
        fullyLoaded={playlist.tracks.total <= tracks.length}
        loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)}
        type={"playlist"}
        playlist={playlist}
        tracks={tracks}
        id_tracklist={id}
      />
    </div>
  );
}
