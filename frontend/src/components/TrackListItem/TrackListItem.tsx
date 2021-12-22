/* eslint-disable no-unused-vars */
//anyone know how to satisfy eslint and the unused prop function variables????
import React, {useCallback, useEffect, useState} from "react";
import {
  AlbumObjectSimplified,
  ArtistObjectSimplified,
  TrackObjectFull,
  TrackObjectSimplified,
} from "spotify-types";
import { formatTimeDiff, formatTimestamp } from "../../utils/functions";
import Checkbox from "../Checkbox/Checkbox";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./TrackListItem.scss";
import {API_URL} from "../../utils/constants";

type Body = {
  context_uri: string | undefined,
  position_ms: number | undefined,
  offset?: {
    uri: string | undefined
  }
};

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
  id_tracklist: string;
  type: string;
};

function TrackListItem(props: Props) {
  const track = props;
  const trackUniqueId = props.track.uri + "-" + props.listIndex;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String | null>(null);
  const id_tracklist= props.id_tracklist;
  const type = props.type;
  const track_uri = "spotify:track:" + props.track.id;

  const sendRequest = useCallback(async () => {
    // POST request using fetch inside useEffect React hook
    let context_uri;
    if (type === "album"){
      context_uri = "spotify:album:" + id_tracklist;
    } else if (type=="playlist") {
      context_uri = "spotify:playlist:" + id_tracklist;
    } else if (type === 'saved') {
      const userId = await fetchUserId();
      context_uri = userId + ':collection:'
    }
    const body: Body = {
      context_uri: context_uri,
      position_ms: 0
    }
    if (type !== 'saved') {
      body.offset = {
        uri: track_uri
      }
    }
    fetch(`${API_URL}api/spotify/me/player/play`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
        .then(response => response.json())
  }, []);

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

    if (e.detail === 2) sendRequest()
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    props.onContextMenuOpen(trackUniqueId, e.pageX, e.pageY);
  };

  const fetchUserId = async () => {
    return await fetch(`${API_URL}api/spotify/me`).then(res => res.json()).then(data => data.uri)};

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
