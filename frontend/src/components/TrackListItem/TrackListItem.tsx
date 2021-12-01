/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { TrackObjectFull } from "spotify-types";
import "./TrackListItem.scss";

type Props = {
  list_index: number;
  track_id: String;
  track_uri: String;
  type: String;
  selected: boolean;
  onSelectionChange: (
    trackId: String,
    isSelected: boolean,
    specialKey: String | null
  ) => void;
  onContextMenuOpen: (trackId: String, x: number, y: number) => void;
};

function TrackListItem(props: Props) {
  const id = props.track_id;
  const uri = props.track_uri;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String | null>(null);

  useEffect(() => {
    props.onSelectionChange(uri, selected, specialKey);
  }, [selected]);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const handleClick = (e: any) => {
    if (e.shiftKey) {
      setSpecialKey("shift");
    } else if (e.ctrlKey) {
      setSpecialKey("ctrl");
    } else {
      setSpecialKey(null);
    }
    setSelected(!selected);
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    props.onContextMenuOpen(uri, e.pageX, e.pageY);
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

  if (!track)
    return (
      <tr>
        <td>loading...</td>
      </tr>
    );

  function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds: string = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
  }

  return (
    <>
      <tr
        className={`TrackListItem ${selected ? "selected" : ""}`}
        onClick={(e) => handleClick(e)}
        onContextMenu={(e) => handleRightClick(e)}
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
