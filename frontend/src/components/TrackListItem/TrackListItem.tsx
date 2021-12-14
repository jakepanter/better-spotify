/* eslint-disable no-unused-vars */
//anyone know how to satisfy eslint and the unused prop function variables????
import React, { useEffect, useState } from "react";
import {
  AlbumObjectSimplified,
  ArtistObjectSimplified,
  TrackObjectFull,
  TrackObjectSimplified,
} from "spotify-types";
import { formatTimeDiff, formatTimestamp } from "../../utils/functions";
import Checkbox from "../Checkbox/Checkbox";
import "./TrackListItem.scss";

type Props = {
  track: TrackObjectFull | TrackObjectSimplified;
  name: string;
  artists: ArtistObjectSimplified[];
  duration_ms: number;
  added_at?: string;
  liked?: boolean;
  album?: AlbumObjectSimplified;
  selected: boolean;
  onSelectionChange: (
    trackUri: String,
    isSelected: boolean,
    specialKey: String | null
  ) => void;
  onContextMenuOpen: (trackUri: String, x: number, y: number) => void;
};

function TrackListItem(props: Props) {
  const track = props;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String | null>(null);

  useEffect(() => {
    props.onSelectionChange(props.track.uri, selected, specialKey);
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
    props.onContextMenuOpen(props.track.uri, e.pageX, e.pageY);
  };

  return (
    <div
      className={`TableRow ${selected ? "Selected" : ""}`}
      onClick={(e) => handleClick(e)}
      onContextMenu={(e) => handleRightClick(e)}
    >
      {track.album !== undefined ? (
        <div className={"TableCell TableCellArtwork"}>
          <img
            style={{ width: "40px", height: "40px" }}
            src={track.album.images[2].url}
            alt=""
          />
        </div>
      ) : (
        <div
          className={"TableCell TableCellArtwork"}
          style={{ width: "40px", height: "40px" }}
        />
      )}
      <div className={"TableCell TableCellTitleArtist"}>
        <span className={"TableCellTitle"}>{track.name}</span>
        <span className={"TableCellArtist"}>
          {track.artists.map((artist) => artist.name).join(", ")}
        </span>
      </div>
      {track.album !== undefined ? (
        <div className={"TableCell TableCellAlbum"}>{track.album.name}</div>
      ) : (
        <></>
      )}
      {track.added_at !== undefined ? (
        <div className={"TableCell TableCellAddedAt"}>
          {formatTimeDiff(new Date(track.added_at).getTime(), Date.now())}
        </div>
      ) : (
        <></>
      )}
      <div className={"TableCell TableCellDuration"}>
        {formatTimestamp(track.duration_ms)}
      </div>
      {track.liked !== undefined ? (
        <div className={"TableCell TableCellLiked"}>
          <Checkbox
            checked={track.liked}
            iconCodeChecked={"favorite"}
            iconCodeUnchecked={"favorite_border"}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default TrackListItem;
