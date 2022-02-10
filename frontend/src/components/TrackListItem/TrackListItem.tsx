/* eslint-disable no-unused-vars */
//anyone know how to satisfy eslint and the unused prop function variables????
import "./TrackListItem.scss";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import {
  AlbumObjectSimplified,
  EpisodeObject,
  ImageObject,
  ShowObjectSimplified,
  ArtistObjectSimplified,
  TrackObjectFull,
  TrackObjectSimplified,
  ResumePointObject,
} from "spotify-types";
import { formatTimeDiff, formatTimestamp } from "../../utils/functions";
import { API_URL } from "../../utils/constants";
import { Tag } from "../../utils/tags-system";
import { TagWithId } from "../../utils/tags-system";
import EpisodePage from "../../pages/EpisodePage/EpisodePage";
import Button from "../Button/Button";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import AppContext from "../../AppContext";
import { getAuthHeader } from "../../helpers/api-helpers";
import { useSelector } from "react-redux";
import { PlaybackState } from "../../utils/playbackSlice";
import { NotificationsService } from "../NotificationService/NotificationsService";

type Body = {
  context_uri: string | undefined;
  position_ms: number | undefined;
  offset?: {
    uri: string | undefined;
  };
};

type Props = {
  track: TrackObjectFull | TrackObjectSimplified | EpisodeObject;
  name: string;
  artists?: ArtistObjectSimplified[];
  duration_ms: number;
  resume_point?: ResumePointObject;
  added_at?: string;
  liked?: boolean;
  album?: AlbumObjectSimplified | ShowObjectSimplified;
  image?: ImageObject;
  description?: string;
  listIndex: number;
  selected: boolean;
  tags?: TagWithId[];
  onSelectionChange: (
    trackUniqueId: String,
    isSelected: boolean,
    specialKey: String | null
  ) => void;
  onContextMenuOpen: (trackUri: String, x: number, y: number) => void;
  id_tracklist: string;
  type: string;
  episode?: boolean;
};

function TrackListItem(props: Props) {
  const track = props;
  const trackUniqueId = props.track.uri + "-" + props.listIndex;
  const [selected, setSelected] = useState<boolean>(props.selected);
  const [specialKey, setSpecialKey] = useState<String | null>(null);
  const [liked, setLiked] = useState<boolean>(!!props.liked);
  const state = useContext(AppContext);
  const playback = useSelector((state: PlaybackState) => state.playback);
  const history = useHistory();

  const id_tracklist = props.id_tracklist;
  const type = props.type;
  let track_uri = "spotify:track:" + props.track.id;
  let dateStr: string = "";

  if (track.added_at != undefined) {
    let date = new Date(track.added_at);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    dateStr = date.getDate() + ". " + months[date.getMonth()] + " " + date.getFullYear();
  }

  const sendRequest = useCallback(async (reqType: string) => {
    if (reqType === "play") {
      // POST request using fetch inside useEffect React hook
      let context_uri;
      if (type === "album") {
        context_uri = "spotify:album:" + id_tracklist;
      } else if (type == "playlist") {
        context_uri = "spotify:playlist:" + id_tracklist;
      } else if (type === "saved") {
        const userId = await fetchUserId();
        context_uri = userId + ":collection:";
      } else if (type === "show") {
        context_uri = "spotify:show:" + id_tracklist;
        track_uri = "spotify:episode:" + props.track.id;
      } else if (type === "search" || type === "topTracks" || type === "tags") {
        context_uri = "spotify:album:" + track.album?.id;
      }
      const body: Body = {
        context_uri: context_uri,
        position_ms: 0,
      };
      if (type !== "saved") {
        body.offset = {
          uri: track_uri,
        };
      }
      const authHeader = getAuthHeader();
      fetch(`${API_URL}api/spotify/me/player/play`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (!res.ok) NotificationsService.push("warning", "No active playback device found");
      });
    } else if (reqType === "pause") {
      const authHeader = getAuthHeader();
      fetch(`${API_URL}api/spotify/me/player/pause`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });
    }
  }, []);

  useEffect(() => {
    props.onSelectionChange(trackUniqueId, selected, specialKey);
  }, [selected]);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const handleClick = (e: any) => {
    if (type != "show") {
      if (e.shiftKey) {
        setSpecialKey("shift");
      } else if (e.ctrlKey) {
        setSpecialKey("ctrl");
      } else if (e.target.className == "TableCellPlayEpisode") {
        sendRequest("play");
      } else {
        setSpecialKey(null);
      }
      setSelected(!selected);

      if (e.detail === 2) sendRequest("play");
    }
  };

  const handlePlayButton = (e: any) => {
    e.preventDefault();
    if (playback.currentTrackId === track.track.id && !playback.paused) sendRequest("pause");
    else sendRequest("play");
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    props.onContextMenuOpen(trackUniqueId, e.pageX, e.pageY);
  };

  const fetchUserId = async () => {
    const authHeader = getAuthHeader();
    return await fetch(`${API_URL}api/spotify/me`, {
      headers: {
        Authorization: authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => data.uri);
  };

  const handleAddToPlaylist = (e: any) => {
    e.stopPropagation();
    state.setContextMenu({
      isOpen: true,
      data: [trackUniqueId],
      x: e.clientX,
      y: e.clientY,
      type: "addToPlaylist",
    });
  };

  const handleLikeButton = async (e: any) => {
    e.stopPropagation();
    if (!liked) {
      // add
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/add?trackIds=${track.track.id}`, {
        headers: {
          Authorization: authHeader,
        },
      }).then((res) => res.json());
      setLiked(true);
    } else {
      // remove
      const authHeader = getAuthHeader();
      await fetch(`${API_URL}api/spotify/me/tracks/remove?trackIds=${track.track.id}`, {
        headers: {
          Authorization: authHeader,
        },
      }).then((res) => res.json());
      setLiked(false);
    }
  };

  const goToArtist = (e: any, artistId: string) => {
    e.preventDefault();
    history.push(`/artist/${artistId}`);
  };

  if (!liked && type === "saved") {
    return <div className="hidden"></div>;
  } else {
    if (type === "show") {
      let dateStr: string = "";
      if (props.added_at) {
        let release = new Date(props.added_at);

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        dateStr =
          release.getDate() +
          ". " +
          months[release.getMonth()] +
          " " +
          release.getFullYear() +
          " - ";
      }

      let progressStr: string = "";
      let progressPercent: string = "0";
      if (props.resume_point?.resume_position_ms && props.duration_ms) {
        progressStr =
          Math.round(
            (props.duration_ms - props.resume_point.resume_position_ms) / 60000
          ).toString() +
          " Minutes and " +
          Math.round(
            ((props.duration_ms - props.resume_point.resume_position_ms) % 60000) / 1000
          ).toString() +
          " sec left";

        if (props.resume_point.fully_played == true) {
          progressPercent = "100";
        } else {
          progressPercent = Math.round(
            (props.resume_point.resume_position_ms / props.duration_ms) * 100
          ).toString();
        }
      } else {
        progressStr =
          Math.round(props.duration_ms / 60000).toString() +
          " Minutes and " +
          Math.round((props.duration_ms % 60000) / 1000).toString() +
          " sec left";
      }
      return (
        <div
          className={`Pointer EpisodeRow ${selected ? "Selected" : ""}
        ${playback.currentTrackId === track.track.id ? "Playing" : ""}
        ${playback.paused ? "Paused" : ""}`}
          onContextMenu={(e) => handleRightClick(e)}
        >
          <Link to={`/episode/${props.track.id}`}>
            <div className="noTags">
              {track.image !== undefined && track.image !== null ? (
                <div className={"TableCell TableCellArtwork"}>
                  <img src={track.image.url} alt="" style={{ width: "100px", height: "100px" }} />
                </div>
              ) : (
                <CoverPlaceholder />
              )}
              <div className={"EpisodeContent"}>
                <h5 className={"TableCellTitleArtist"}>{track.name}</h5>
                <p>{track.description}</p>
                <div className={"TableCellPlayProgress"}>
                  <div className={"PlayProgress"}>
                    <div className={"PlayEpisode"} onClick={(e) => handlePlayButton(e)}></div>
                    <div className={"ReleaseProgress"}>
                      {dateStr}
                      {props.resume_point && props.duration_ms ? <>{progressStr}</> : <></>}
                    </div>
                  </div>
                  <div className={"progress-bar progress-bar-" + progressPercent}></div>
                </div>
              </div>
            </div>
            {track.tags !== undefined ? (
              <div className={"TableCell TableCellTags"}>
                {track.tags.map((t, i) => (
                  <Link key={i} className={`Tag TagColor${t.color}`} to={`/tag/${t.id}`}>
                    {t.title}
                  </Link>
                ))}
              </div>
            ) : (
              <></>
            )}
          </Link>
        </div>
      );
    } else {
      return (
        <div
          className={`Pointer TableRow ${
            (track.album !== undefined && track.album.id !== null) || type === "album"
              ? ""
              : "NotAvailable"
          } ${selected ? "Selected" : ""}
        ${playback.currentTrackId === track.track.id ? "Playing" : ""}
        ${playback.paused ? "Paused" : ""}`}
          onClick={props.episode ? undefined : (e) => handleClick(e)}
          onContextMenu={props.episode ? undefined : (e) => handleRightClick(e)}
        >
          {(track.album !== undefined &&
            track.album.available_markets !== undefined &&
            track.album.images.length !== 0) ||
          (track.album !== undefined && type === "topTracks" && track.album.images.length !== 0) ? (
            <div className={"TableCell TableCellArtwork"} onClick={(e) => handlePlayButton(e)}>
              <img
                src={track.album.images[2].url}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            </div>
          ) : (
            <div className={"TableCellCoverPlaceholder"} onClick={(e) => handlePlayButton(e)}>
              <CoverPlaceholder />
            </div>
          )}

          <div className={"TableCell TableCellTitleArtist"}>
            <span className={"TableCellTitle"}>{track.name}</span>
            {track.artists !== undefined && !props.episode ? (
              <span className={"TableCellArtist"}>
                {/*TODO style bitte anpassen*/}
                <span className={"CardArtist"}>
                  {track.artists
                    ?.map<React.ReactNode>((a) => (
                      <span
                        onClick={(e) => goToArtist(e, a.id)}
                        className={"artists-name"}
                        key={a.id}
                      >
                        {a.name}
                      </span>
                    ))
                    .reduce((a, b) => [a, ", ", b])}
                </span>
              </span>
            ) : (
              <></>
            )}
          </div>
          {track.album !== undefined ? (
            <div className={"TableCell TableCellAlbum"}>
              {props.episode ? (
                <Link to={`/show/${track.album.id}`} className={"albumLink"} key={trackUniqueId}>
                  {track.album.name}
                </Link>
              ) : (
                <Link to={`/album/${track.album.id}`} className={"albumLink"} key={trackUniqueId}>
                  {track.album.name}
                </Link>
              )}
            </div>
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

          <div className={"TableCell TableCellDuration"}>{formatTimestamp(track.duration_ms)}</div>
          {track.liked !== undefined ? (
            <div className={"TableCell TableCellLiked"}>
              <button className={`checkbox ${liked ? "checked" : ""}`} onClick={handleLikeButton}>
                <span className={"material-icons"}>{liked ? "favorite" : "favorite_border"}</span>
              </button>
            </div>
          ) : (
            <></>
          )}
          {track.tags !== undefined ? (
            <div className={"TableCell TableCellTags"}>
              {track.tags.map((t, i) => (
                <Link key={i} className={`Tag TagColor${t.color}`} to={`/tag/${t.id}`}>
                  {t.title}
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className="TableCell TableCellActions">
            <Button
              simple
              icon="playlist_add"
              className="material-icons"
              onClick={props.episode ? undefined : handleAddToPlaylist}
            />
          </div>
        </div>
      );
    }
  }
}

export default TrackListItem;
