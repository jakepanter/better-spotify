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
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./TrackListItem.scss";
import {API_URL} from "../../utils/constants";

type Props = {
  track: TrackObjectFull | TrackObjectSimplified;
  name: string;
  artists: ArtistObjectSimplified[];
  duration_ms: number;
  added_at?: string;
  liked?: boolean;
  album?: AlbumObjectSimplified;
  listIndex: number;
  selected: boolean;
  onSelectionChange: (
    trackUniqueId: String,
    isSelected: boolean,
    specialKey: String | null
  ) => void;
  onContextMenuOpen: (trackUri: String, x: number, y: number) => void;
};

function TrackListItem(props: Props) {
  const track = props;
  const trackUniqueId = props.track.uri + "-" + props.listIndex;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String | null>(null);
  const [liked, setLiked] = useState<boolean>(!!props.liked);

  useEffect(() => {
    props.onSelectionChange(trackUniqueId, selected, specialKey);
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
    props.onContextMenuOpen(trackUniqueId, e.pageX, e.pageY);
  };

  const handleLikeButton = async (e: any) => {
    e.stopPropagation();
    if (!liked) {
      // add
      await fetch(`${API_URL}api/spotify/me/tracks/add?trackIds=${track.track.id}`)
        .then((res) => res.json());
      setLiked(true);
    } else {
      // remove
      await fetch(`${API_URL}api/spotify/me/tracks/remove?trackIds=${track.track.id}`)
        .then((res) => res.json());
      setLiked(false);
    }
  };

  return (
    <div
      className={`TableRow ${selected ? "Selected" : ""}`}
      onClick={(e) => handleClick(e)}
      onContextMenu={(e) => handleRightClick(e)}
    >
      {track.album !== undefined &&
      track.album.available_markets !== undefined ? (
        <div className={"TableCell TableCellArtwork"}>
          <img
            src={track.album.images[2].url}
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
        </div>
      ) : (
        <CoverPlaceholder />
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
          <button className={`checkbox ${liked ? 'checked' : ''}`} onClick={handleLikeButton}>
            <span className={'material-icons'}>{liked ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default TrackListItem;
