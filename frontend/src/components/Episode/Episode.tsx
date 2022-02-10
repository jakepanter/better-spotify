import React, { useCallback, useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import { EpisodeObject, SingleEpisodeResponse } from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Episode.scss";
import { getAuthHeader } from '../../helpers/api-helpers';
import { useSelector } from "react-redux";
import {PlaybackState} from "../../utils/playbackSlice";
import {NotificationsService} from "../NotificationService/NotificationsService";

interface IProps {
  id: string;
}

type Body = {
  context_uri: string | undefined,
  position_ms: number | undefined,
  offset?: {
    uri: string | undefined
  }
};

export default function Episode(props: IProps) {
  const { id } = props;
  const [episode, setEpisode] = useState<EpisodeObject>();
  var body: Body;
  const playback = useSelector((state: PlaybackState) => state.playback);

  async function fetchEpisodeData() {
    const authHeader = getAuthHeader();
    const data: SingleEpisodeResponse = await fetch(
      `${API_URL}api/spotify/episode/${id}`, {
          headers: {
            'Authorization': authHeader
          }
        }).then((res) => res.json());
    
    const context_uri = "spotify:show:" + data.show.id;
    const track_uri = "spotify:episode:" + id;

    body = {
      context_uri: context_uri,
      position_ms: 0
    }

    body.offset = {
      uri: track_uri
    }

    setEpisode(data);
  }

  const sendRequest = useCallback(async (reqType: string) => {
    const authHeader = getAuthHeader();
    if (reqType === 'play') {
      fetch(`${API_URL}api/spotify/me/player/play`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(body)
      }).then((res) => {
        if (res.status === 404) NotificationsService.push('warning', 'No active playback device found');
        if (res.status === 403) NotificationsService.push('info', 'This track cannot be played');
      });
    } else if (reqType === 'pause') {
      fetch(`${API_URL}api/spotify/me/player/pause`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      })
    }
  }, []);

  useEffect(() => {
    fetchEpisodeData();
  }, [id]);

  if (!episode) return <p>loading...</p>;

  let dateStr: string = "";
  if(episode.release_date) {
    let release = new Date(episode.release_date);

    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dateStr = release.getDate() + ". " + months[release.getMonth()] + " " + release.getFullYear();
  }

  return (
    <div className={`Playlist
        ${playback.currentTrackId === episode.id ? "EpisodePlaying" : ""}
        ${playback.paused ? "EpisodePaused" : ""}`}>
      <div className={"PlaylistHeader PlaylistHeaderFull"}>
        <div className={"PlaylistHeaderCover"}>
          {episode.images !== undefined ? (
            <img src={episode.images[1].url} alt={"Album Cover"} />
          ) : (
            <CoverPlaceholder />
          )}
        </div>
        <div className={"PlaylistHeaderMeta"}>
          <h4>Podcast Episode</h4>
          <h1>{episode.name}</h1>
          <p>
            by {episode.show.publisher}, {dateStr}   
          </p>
          <p>
            {episode.show.name}
          </p>
        </div>
        <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
      </div>
      <div>
      <div className="EpisodeControl">
        {playback.currentTrackId === episode.id && !playback.paused
            ? <div className={"PlayEpisode"} onClick={() => sendRequest('pause')}/>
            : <div className={"PlayEpisode"} onClick={() => sendRequest('play')}/>
        }
        <NavLink title={"All Episodes"} className="AllEpisodes button" to={`/show/${episode.show.id}`} exact>
            <span className="left-side-panel--text">All Episodes</span>
        </NavLink>
      </div>
      </div>
      <div className="EpisodeDescription">
        <h4>Description</h4>
        {episode.description}
      </div>
    </div>
  )
}
