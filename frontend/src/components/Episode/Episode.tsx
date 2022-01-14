import React, { useEffect, useState } from "react";
import { EpisodeObjectFull, SingleEpisodeResponse } from "spotify-types";
import { API_URL } from "../../utils/constants";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";

interface IProps {
    id: string;
}

export default function Episode(props: IProps) {
    const { id } = props;
    const [episode, setEpisode] = useState<EpisodeObjectFull>();
    
    async function fetchEpisodeData() {
        const data: SingleEpisodeResponse = await fetch(
            `${API_URL}api/spotify/episode/${id}`        
        ).then((res) => res.json());

        setEpisode(data);
    }

    useEffect(() => {
        fetchEpisodeData();
    }, [id]);

    if(!episode) return <p>loading...</p>;

    return <div className={"Playlist"}>
      <div className={"PlaylistHeader PlaylistHeaderFull"}>
        <div className={"PlaylistHeaderCover"}>
          {episode.images !== undefined ? (
            <img src={episode.images[1].url} alt={"Album Cover"} />
          ) : (
            <CoverPlaceholder/>
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
      <div className="EpisodeDescription">
        {episode.description}
      </div>
      
    )
  ) : (
    <></>
  )
  </div>
}