import React, { useCallback, useEffect, useState } from "react";
import { TrackObjectFull } from "spotify-types";
//import SpotifyWebPlayer from "react-spotify-web-playback";

type Props = {
  id_track: String;
  id_tracklist: String;
  type: String;
};

function TrackListItem(props: Props) {
  const id = props.id_track;
  const id_tracklist= props.id_tracklist;
  const type = props.type;
  const track_uri = "spotify:track:" + id;
  var requestOptions;
  const sendRequest = useCallback(async () => {
    // POST request using fetch inside useEffect React hook
    var context_uri;
    if(type==="album"){
      context_uri = "spotify:album:" + id_tracklist;
    } else if (type==="playlist") {
      context_uri = "spotify:playlist:" + id_tracklist;
    } else if (type==="saved") {
      context_uri = id_tracklist + ":collection";
    } 
    requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "context_uri": context_uri,
        "offset": {"uri": track_uri},
        "position_ms": 0,
      })
    };
    fetch('http://localhost:5000/api/spotify/me/player/play', requestOptions)
        .then(response => response.json()) 
  }, []);

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
            <td><img onClick={sendRequest} style={{width: "40px", height: "40px"}} src={track.album.images[2].url} alt=""/></td>
            <td>{track.name}</td>
            <td>{track.artists.map((artist) => artist.name).join(", ")}</td>
            <td>{track.duration_ms/1000}</td>
        </tr>
    </>
  );
}


export default TrackListItem;
