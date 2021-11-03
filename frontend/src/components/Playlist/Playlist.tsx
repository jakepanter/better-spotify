import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Playlist.scss";
import TrackListItem from "../TrackListItem/TrackListItem";

function Playlist() {
  const [playlist, setPlaylist]: any = useState();

  //get route params (:playlistId)
  let params = useParams() as { id: string };
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `http://localhost:5000/api/spotify/playlist/${params.id}`
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
          {playlist?.tracks.items.map((item: any) => {
            return (
              <TrackListItem
                key={item.track.id}
                track={item.track}
              ></TrackListItem>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Playlist;
