import React, { useEffect, useState } from "react";
import { AlbumObjectFull } from "spotify-types";
import { API_URL } from '../../utils/constants';
import TrackList from "../TrackList/TrackList";

interface IProps {
  id: string;
}

export default function Album(props: IProps) {
  const { id } = props;
  const [album, setAlbum] = useState<AlbumObjectFull>();

  useEffect(() => {
    async function fetchData() {
      const data: AlbumObjectFull = await fetch(
        `${API_URL}api/spotify/album/${id}`
      ).then((res) => res.json());
      setAlbum(data);
    }
    fetchData();
  }, [id]);

  if (!album) return <p>loading...</p>;

  return (
    <>
      <TrackList type={"album"} data={album}/>
    </>
  );
}
