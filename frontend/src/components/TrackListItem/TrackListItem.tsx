import React from "react";

type Props = {
  track: {
    id: string;
    name: string;
    album: {
      name: string;
      images: {
        height: number;
        width: number;
        url: string;
      }[];
    };
    artists: [string];
  };
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
          {track.artists.map((artist: any) => artist.name).join(", ")}
        </p>
      </div>
    </li>
  );
}

export default TrackListItem;
