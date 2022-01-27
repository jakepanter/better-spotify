import React, { useCallback, useEffect, useState } from "react";
import {NavLink} from "react-router-dom";
import { EpisodeObject, SingleEpisodeResponse } from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Episode.scss";


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
    const data: SingleEpisodeResponse = await fetch(
      `${API_URL}api/spotify/episode/${id}`
    ).then((res) => res.json());
    
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
    fetch(`${API_URL}api/spotify/me/player/play`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
        .then(response => response.json())
  }, []);

  useEffect(() => {
    fetchEpisodeData();
  }, [id]);

  if (!episode) return <p>loading...</p>;

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
