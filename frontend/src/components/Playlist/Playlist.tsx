import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Playlist.scss";
import TrackList from "../TrackList/TrackList";
import { PlaylistObjectFull } from "spotify-types";
import { API_URL } from '../../utils/constants';

function Playlist() {
  const [playlist, setPlaylist] = useState<PlaylistObjectFull>();

  //get route params (:playlistId)
  let params = useParams() as { id: string };
  useEffect(() => {
    async function fetchData() {
      const data: PlaylistObjectFull = await fetch(
        `${API_URL}api/spotify/playlist/${params.id}`
      ).then((res) => res.json());
      setPlaylist(data);
    }
    fetchData();
  }, [params]);

  if (!playlist) return <p>loading...</p>;

  return (
    <>
      <TrackList type={"playlist"} id_tracklist={playlist.id} data={playlist}/>
    </>
  );
}

export default Playlist;