import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Album() {
  const [album, setAlbum]: any = useState();

  //get route params (:albumId)
  let params = useParams() as { id: string };
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `http://localhost:5000/api/spotify/album/${params.id}`
      ).then((res) => res.json());
      setAlbum(data);
    }
    fetchData();
  }, [params]);

  if (!album) return <p>loading...</p>;

  return (
    <>
      <div className={"Playlist"}>
        <img src={album.images[0].url} alt="" width={128} />
        <h2>{album.name}</h2>
        <h3>{album.artists.map((artist: any) => artist.name).join(", ")}</h3>
        <ul>
          {album?.tracks.items.map((item: any) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
      </div>
    </>
  );
}
