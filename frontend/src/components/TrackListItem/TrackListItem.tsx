import React from "react";
import { TrackObjectFull } from "spotify-types";

type Props = {
  track: TrackObjectFull;
};

function TrackListItem(props: Props) {
  const track = props.track;
  return (
    <li key={track.id} className={"Track"}>
      <div>
        <img
          src={track.album.images[2].url}
          alt={`${track.album.name} Cover`}
        />
        <p style={{ display: "inline-block", verticalAlign: "bottom" }}>
          {track.name} - {track.album.name} <br />
          {track.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
    </li>
  );
}

export default TrackListItem;
