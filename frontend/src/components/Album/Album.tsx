import React, { useEffect, useState } from "react";
import {
  AlbumObjectFull,
  AlbumTracksResponse,
  CheckUsersSavedTracksResponse,
  SingleAlbumResponse,
  TrackObjectSimplified
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";

// The fetching limit, can be adjusted by changing this value
const limit = 20;

// The album object itself
interface IProps {
  id: string;
  headerStyle: 'none' | 'compact' | 'full';
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

  async function fetchAlbumData() {
    const data: SingleAlbumResponse = await fetch(
      `${API_URL}api/spotify/album/${id}?limit=${limit}`
    ).then((res) => res.json());

    // Save album data
    setAlbum(data);

    // Save if tracks are saved
    const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(data.tracks.items.map((i) => i.id));
    const fetchedTracks = data.tracks.items as AlbumTrack[];
    setTracks((oldTracks) => [...oldTracks, ...fetchedTracks.map((t, i) => {
      t.is_saved = saved[i];
      return t;
    })]);
  }

  async function fetchAlbumTrackData(newOffset: number) {
    // Only fetch if there are tracks left to fetch
    if (album && album.tracks && album.tracks.total && album.tracks.total <= offset) return;

    const data: AlbumTracksResponse = await fetch(
      `${API_URL}api/spotify/album/${id}/tracks?offset=${newOffset}&limit=${limit}`
    ).then((res) => res.json());

    // Save if tracks are saved
    const saved: CheckUsersSavedTracksResponse = await fetchIsSavedData(data.items.map((i) => i.id));
    const fetchedTracks = data.items as AlbumTrack[];
    setTracks((oldTracks) => [...oldTracks, ...fetchedTracks.map((t, i) => {
      t.is_saved = saved[i];
      return t;
    })]);
  }

  async function fetchIsSavedData(trackIds: string[]) {
    const data: CheckUsersSavedTracksResponse = await fetch(
      `${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`
    ).then((res) => res.json());

    return data;
  }

  // Fetch the main album data
  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  // Fetch more album tracks if necessary
  useEffect(() => {
    fetchAlbumTrackData(offset);
  }, [offset]);

  if (!album) return <p>loading...</p>;

  return (
    <div className={'Playlist'}>
      {headerStyle !== 'none' ?
        headerStyle === 'compact' ?
          <div className={'PlaylistHeader PlaylistHeaderCompact'}>
            <h2>{album.artists.map((a) => a.name)[0]} — {album.name}</h2>
          </div>
          :
          <div className={'PlaylistHeader PlaylistHeaderFull'}>
            <div className={'PlaylistHeaderCover'}>
            {album.images !== undefined 
              ? <img src={album.images[1].url} alt={'Album Cover'}/>
              : <CoverPlaceholder/>
            }
            </div>
            <div className={'PlaylistHeaderMeta'}>
              <h1>{album.name}</h1>
              <p>
                by {album.artists.map((a) => a.name).join(', ')} — {album.tracks.total} Song{album.tracks.total === 1 ? '' : 's'}
              </p>
            </div>
            <div className={'PlaylistHeaderFilter'}>
              {/* Filter */}
            </div>
          </div>
        :
        <></>}
      <TrackList fullyLoaded={album.tracks.total <= tracks.length}
                 loadMoreCallback={() => setOffset((currentOffset) => currentOffset + limit)}
                 type={'album'}
                 tracks={tracks}/>
    </div>
  );
}
