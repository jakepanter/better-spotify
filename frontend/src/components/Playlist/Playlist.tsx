import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Playlist.scss";
import TrackListItem from "../TrackListItem/TrackListItem";
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
      <div className={"Playlist"}>
        <img src={playlist.images[0].url} alt="" width={128} />
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>
        <p>by {playlist.owner.display_name}</p>
        <ul>
          {playlist?.tracks.items.map((item) => {
            return <TrackListItem key={item.track.id} track={item.track} />;
          })}
        </ul>
      </div>
    </>
  );
}

export default Playlist;
