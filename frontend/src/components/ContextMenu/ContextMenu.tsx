import React from "react";

type Props = {
  tracks: String[];
  positionX: number;
  positionY: number;
};

function ContextMenu(props: Props) {
  const { tracks, positionX, positionY } = props;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: positionX + "px",
          top: positionY + "px",
          backgroundColor: "lightgrey",
          minWidth: "200px",
        }}
      >
        <ul>
          {tracks.map((track: String) => (
            <li key={track.toString()}>{track}</li>
          ))}
          <li>Add to Queue</li>
          <li>Add to Playlist</li>
          <li>Like Song</li>
          <li>More Info</li>
        </ul>
      </div>
    </>
  );
}

export default ContextMenu;
