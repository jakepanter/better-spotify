import React, { useCallback, useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import { EpisodeObject, SingleEpisodeResponse } from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Episode.scss";
import { getAuthHeader } from '../../helpers/api-helpers';

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

  const sendRequest = useCallback(async () => {
    const authHeader = getAuthHeader();
    fetch(`${API_URL}api/spotify/me/player/play`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    })
        .then(response => response.json())
  }, []);

  useEffect(() => {
    fetchEpisodeData();
  }, [id]);

  if (!episode) return <p>loading...</p>;

  let dateStr: string = "";
  if(episode.release_date) {
    let release = new Date(episode.release_date);

    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dateStr = release.getDate() + ". " + months[release.getMonth()] + " " + release.getFullYear() + " - ";
  }

  let progressStr: string = "";
  let progressPercent: string = "0";
  if(episode.resume_point?.resume_position_ms && episode.duration_ms) {
    progressStr = Math.round((episode.duration_ms - episode.resume_point.resume_position_ms)/60000).toString() + " Minutes and " + Math.round(((episode.duration_ms - episode.resume_point.resume_position_ms))%60000/1000).toString() + " sec left";
    
    if(episode.resume_point.fully_played == true) {
      progressPercent = "100"
    } else {
      progressPercent = Math.round((episode.resume_point.resume_position_ms / episode.duration_ms)*100).toString();  
    }
  } else {
    progressStr = Math.round((episode.duration_ms)/60000).toString() + " Minutes and " + Math.round((episode.duration_ms)%60000/1000).toString() + " sec left";
  }

  return (
    <div className={"Playlist"}>
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
            by {episode.show.publisher}
          </p>
          <p>
            {episode.show.name}
          </p>
        </div>
        <div className={"PlaylistHeaderFilter"}>{/* Filter */}</div>
      </div>
      <div>
      <div className="EpisodeControl">
        <div className={"PlayEpisode"} onClick={() => sendRequest()}/>
        <div className={"ReleaseProgress"}>
          {dateStr}  
          {episode.resume_point && episode.duration_ms ? (
          <>
          {progressStr}
          </>
          ) : (<></>)} 
        </div>
        <div className={"progress-bar progress-bar-" + progressPercent}></div>
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
