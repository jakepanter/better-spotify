/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { TrackObjectFull } from "spotify-types";
//import SpotifyWebPlayer from "react-spotify-web-playback";

type Props = {
  list_index: number;
  id_track: String;
  type: String;
  selected: boolean;
  onSelectionChange: (
    trackId: String,
    isSelected: boolean,
    specialKey: String
  ) => void;
};

function TrackListItem(props: Props) {
  const id = props.id_track;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String>("");

  useEffect(() => {
    props.onSelectionChange(id, selected, specialKey);
  }, [selected]);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const handleClick = (e: any) => {
    console.log(e.button);
    if (e.button === 2) {
      //rightclick
      console.log("rightclick");
    }
    if (e.shiftKey) {
      console.log("shift");
      setSpecialKey("shift");
    } else if (e.ctrlKey) {
      console.log("ctrl");
      setSpecialKey("ctrl");
    } else {
      console.log("nope");
      setSpecialKey("");
    }
    setSelected(!selected);
  };

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

  function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds: string = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
  }

  return (
    <>
      <tr
        style={{
          backgroundColor: `${selected ? "lightgrey" : ""}`,
          userSelect: "none",
        }}
        onClick={(e) => handleClick(e)}
      >
        <td>
          <img
            style={{ width: "40px", height: "40px" }}
            src={track.album.images[2].url}
            alt=""
          />
        </td>
        <td>{track.name}</td>
        <td>{track.artists.map((artist) => artist.name).join(", ")}</td>
        <td>{millisToMinutesAndSeconds(track.duration_ms)}</td>
      </tr>
    </>
  );
}

export default TrackListItem;
