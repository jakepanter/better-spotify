import React, { useEffect, useState } from "react";
import "./Playlist.scss";
import TrackList from "../TrackList/TrackList";
import { PlaylistObjectFull } from "spotify-types";
import { API_URL } from '../../utils/constants';

interface IProps {
  id: string;
}

function Playlist(props: IProps) {
  const { id } = props;
  const [playlist, setPlaylist] = useState<PlaylistObjectFull>();

  useEffect(() => {
    async function fetchData() {
      const data: PlaylistObjectFull = await fetch(
        `${API_URL}api/spotify/playlist/${id}`
      ).then((res) => res.json());
      setPlaylist(data);
    }
    fetchData();
  }, [id]);

  if (!playlist) return <p>loading...</p>;

  return (
    <>
      <TrackList type={"playlist"} data={playlist}/>
    </>
  );
}

export default Playlist;
