import React, { useEffect, useState } from "react";
import { TrackObjectFull } from "spotify-types";
//import SpotifyWebPlayer from "react-spotify-web-playback";

type Props = {
  id_track: String;
  type: String;
};

function TrackListItem(props: Props) {
  const id = props.id_track;
  //const type = props.type

  const [track, setTrack] = useState<TrackObjectFull>();
  useEffect(() => {
    async function fetchData() {
      const data: TrackObjectFull = await fetch(
        `http://localhost:5000/api/spotify/track/${id}`
      ).then((res) => res.json());
      setTrack(data);
    }
    fetchData();
  }, [id]);

  if (!track) return <p>loading...</p>;

  return (
    <>
        <tr>
            <td><img style={{width: "40px", height: "40px"}} src={track.album.images[2].url} alt=""/></td>
            <td>{track.name}</td>
            <td>{track.artists.map((artist) => artist.name).join(", ")}</td>
            <td>{track.duration_ms/1000}</td>
        </tr>
    </>
  );
}

export default TrackListItem;
