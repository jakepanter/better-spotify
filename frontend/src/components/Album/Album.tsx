import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlbumObjectFull } from "spotify-types";
import TrackList from "../TrackList/TrackList";

export default function Album() {
  const [album, setAlbum] = useState<AlbumObjectFull>();

  //get route params (:albumId)
  let params = useParams() as { id: string };
  useEffect(() => {
    async function fetchData() {
      const data: AlbumObjectFull = await fetch(
        `http://localhost:5000/api/spotify/album/${params.id}`
      ).then((res) => res.json());
      setAlbum(data);
    }
    fetchData();
  }, [params]);

  if (!album) return <p>loading...</p>;

  return (
    <>
      <TrackList type={"album"} id_tracklist={album.id} data={album}/>
    </>
  );
}