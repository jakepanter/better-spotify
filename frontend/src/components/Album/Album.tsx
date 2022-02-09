import React, { useEffect, useState } from "react";
import {
  AlbumObjectFull,
  AlbumTracksResponse,
  CheckUserSavedAlbumsResponse,
  CheckUsersSavedTracksResponse,
  SingleAlbumResponse,
  TrackObjectSimplified,
} from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from "../../helpers/api-helpers";
import { Link } from "react-router-dom";
import "./Album.scss";

// The fetching limit, can be adjusted by changing this value
const limit = 20;

// The album object itself
interface IProps {
  id: string;
  headerStyle: "none" | "compact" | "full";
  multipleAlbums?: number;
}

export interface AlbumTrack extends TrackObjectSimplified {
  is_saved: boolean;
}

export default function Album(props: IProps) {
  const { id, headerStyle } = props;
  const [album, setAlbum] = useState<AlbumObjectFull>();
  // The list of tracks of the album
  const [tracks, setTracks] = useState<AlbumTrack[]>([]);
  // The current offset for fetching new tracks
  const [offset, setOffset] = useState<number>(limit);
  const [liked, setLiked] = useState<boolean>();
 
  async function fetchAlbumData() {
    const authHeader = getAuthHeader();
    const data: SingleAlbumResponse = await fetch(
      `${API_URL}api/spotify/album/${id}?limit=${limit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    // Save album data
    setAlbum(data);

    //get Saved Status and set it
    const albumLiked: CheckUserSavedAlbumsResponse = await isAlbumSavedData(
      [data.id]
    );
    setLiked(albumLiked[0]);

    // Save if tracks are saved
    const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(
      data.tracks.items.map((i) => i.id)
    );
    const fetchedTracks = data.tracks.items as AlbumTrack[];
    setTracks((oldTracks) => [
      ...oldTracks,
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }),
    ]);
  }

  async function fetchAlbumTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (album && album.tracks && album.tracks.total && album.tracks.total <= offset) return;

    const authHeader = getAuthHeader();
    const data: AlbumTracksResponse = await fetch(
      `${API_URL}api/spotify/album/${id}/tracks?offset=${newOffset}&limit=${limit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    let saved: CheckUsersSavedTracksResponse = [];
    const savedAlbums = data.items.map((i) => i.id);
    if (savedAlbums.length !== 0) {
      // Save whether tracks are saved or not
      saved = await fetchIsSavedData(savedAlbums);
    }
    const fetchedTracks = data.items as AlbumTrack[];
    setTracks((oldTracks) => [
      ...oldTracks,
      // Check if track is saved or not and set is_saved-property
      ...fetchedTracks.map((t, i) => {
        t.is_saved = saved[i];
        return t;
      }),
    ]);
  }

  async function isAlbumSavedData(albumIds: string[]) {
    const authHeader = getAuthHeader();
    const data: CheckUserSavedAlbumsResponse = await fetch(
      `${API_URL}api/spotify/me/albums/contains?albumIds=${albumIds}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    return data;
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

  const handleLikeButton = async () => {
    if(album !== undefined) {
      if (!liked) {
        // add
        const authHeader = getAuthHeader();
        await fetch(`${API_URL}api/spotify/me/albums/add?albumIds=${album.id}`, {
          headers: {
            Authorization: authHeader,
          },
        }).then((res) => res.json());
        setLiked(true);
      } else {
        // remove
        const authHeader = getAuthHeader();
        await fetch(`${API_URL}api/spotify/me/albums/remove?albumIds=${album.id}`, {
          headers: {
            Authorization: authHeader,
          },
        }).then((res) => res.json());
        setLiked(false);
      }
    } 
  };

  // Fetch the main album data
  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  // Fetch more album tracks if necessary
  useEffect(() => {
    if (album) fetchAlbumTrackData(offset);
  }, [offset]);

  if (!album) {
    if(!props.multipleAlbums) return <p>loading...</p>;
    else if(props.multipleAlbums === 0) return <p>loading...</p>;
    else return <></>;
  }

  return (
    <div className={"Playlist"}>
      {headerStyle !== "none" ? (
        headerStyle === "compact" ? (
          <div className={"PlaylistHeader PlaylistHeaderCompact"}>
            <h2>
              {album.artists.map((a) => a.name)[0]} — {album.name}
            </h2>
          </div>
        ) : (
          <div className={"PlaylistHeader PlaylistHeaderFull"}>
            <div className={"PlaylistHeaderCover"}>
              {album.images !== undefined ? (
                <img src={album.images[1].url} alt={"Album Cover"} />
              ) : (
                <CoverPlaceholder />
              )}
            </div>
            <div className={"PlaylistHeaderMeta"}>
              <h4>Album</h4>
              <h1>{album.name}</h1>
              <p>
                by{" "}
                {album.artists
                  .map<React.ReactNode>((a) => (
                    <Link to={`/artist/${a.id}`} className={"artists-name"} key={a.id}>
                      {a.name}
                    </Link>
                  ))
                  .reduce((a, b) => [a, ", ", b])}{" "}
                — {album.release_date.substring(0, 4)} — {album.tracks.total} Song
                {album.tracks.total === 1 ? "" : "s"}
              </p>
            </div>            
            <div className={"PlaylistHeaderFilter albumsLikeOption"}>
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
        fullyLoaded={album.tracks.total <= tracks.length}
        loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)}
        type={"album"}
        tracks={tracks}
        id_tracklist={album.id}
      />
    </div>
  );
}
