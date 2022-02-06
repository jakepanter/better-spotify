import React, { useState, useEffect } from "react";
import { API_URL } from "../../../utils/constants";
import { CheckUsersSavedTracksResponse, SearchResponse } from "spotify-types";
import { useParams } from "react-router-dom";
import TrackList from "../../TrackList/TrackList";
import { getAuthHeader } from "../../../helpers/api-helpers";
import Card from "../../Card/Card";
import "./SearchPageCustom.scss";

export default function SearchPageCustom() {
  let params = useParams() as { type: string; search: string };
  const search = params.search;
  const type = params.type;
  const [result, setSearchResult] = useState<SearchResponse>();
  const [tracksSaved, setSaved] = useState<CheckUsersSavedTracksResponse>();

  async function fetchSearchResult() {
    const authHeader = getAuthHeader();
    const data: SearchResponse = await fetch(
      `${API_URL}api/spotify/customsearch?type=${type}&search=${search}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());

    setSearchResult(data);

    if (data.tracks?.items && data.tracks.items.length > 0) {
      const trackIds = data.tracks?.items.map((i) => i.id);
      //Check if tracks of search results are saved by User
      const saved = await fetch(`${API_URL}api/spotify/me/tracks/contains?trackIds=${trackIds}`, {
        headers: {
          Authorization: authHeader,
        },
      }).then((res) => res.json());

      setSaved(saved);
    }
  }

  const handleRightClick = () => {
    console.log("clicked");
  };

  useEffect(() => {
    fetchSearchResult();
  }, [type]);

  if (!result) return <p></p>;

  if (type == "tracks") {
    if (result.tracks?.items && result.tracks.items.length > 0 && tracksSaved) {
      const searchTracks = (
        <TrackList
          fullyLoaded={true}
          type={"search"}
          tracks={result.tracks?.items}
          loadMoreCallback={() => null}
          id_tracklist={search}
          is_saved={tracksSaved}
        />
      );

      return (
        <div className={"SearchPageCustom"}>
          <h2 className="Header">Search Tracks: &quot;{search}&quot;</h2>
          <div style={{ margin: "1rem", overflow: "hidden" }}>{searchTracks}</div>
        </div>
      );
    }
  }

  if (type == "albums") {
    const searchAlbums = result.albums?.items.map((item) => {
      return (
        <Card
          key={item.id}
          item={item.id}
          linkTo={`/album/${item.id}`}
          imageUrl={item.images.length > 0 ? item.images[0].url : ""}
          title={item.name}
          subtitle={item.artists.map((a) => a.name).join(", ")}
          handleRightClick={handleRightClick}
        />
      );
    });

    return (
      <div className={"SearchPageCustom"}>
        <h2 className="Header">Search Album: &quot;{search}&quot;</h2>
        <div className={"Content"}>
          <div className={"CoverList"}>{searchAlbums}</div>
        </div>
      </div>
    );
  }

  if (type == "playlists") {
    const searchPlaylists = result.playlists?.items.map((item) => {
      return (
        <Card
          key={item.id}
          item={item.id}
          linkTo={`/playlist/${item.id}`}
          imageUrl={item.images.length > 0 ? item.images[0].url : ""}
          title={item.name}
          subtitle={item.owner.display_name}
          handleRightClick={handleRightClick}
        />
      );
    });

    return (
      <div className={"SearchPageCustom"}>
        <h2 className="Header">Search Playlist: &quot;{search}&quot;</h2>
        <div className={"Content"}>
          <div className={"CoverList"}>{searchPlaylists}</div>
        </div>
      </div>
    );
  }

  if (type == "artists") {
    const searchArtists = result.artists?.items.map((item) => {
      return (
        <Card
          key={item.id}
          item={item.id}
          linkTo={`/artist/${item.id}`}
          imageUrl={item.images.length > 0 ? item.images[0].url : ""}
          title={item.name}
          handleRightClick={handleRightClick}
          roundCover={true}
        />
      );
    });

    return (
      <div className={"SearchPageCustom"}>
        <h2 className="Header">Search Artist: &quot;{search}&quot;</h2>
        <div className={"Content"}>
          <div className={"CoverList"}>{searchArtists}</div>
        </div>
      </div>
    );
  }

  if (type == "shows") {
    const searchShows = result.shows?.items.map((item) => {
      return (
        <Card
          key={item.id}
          item={item.id}
          linkTo={`/show/${item.id}`}
          imageUrl={item.images.length > 0 ? item.images[0].url : ""}
          title={item.name}
          subtitle={item.publisher}
          handleRightClick={handleRightClick}
        />
      );
    });

    return (
      <div className={"SearchPageCustom"}>
        <h2 className="Header">Search Podcast: &quot;{search}&quot;</h2>
        <div className={"Content"}>
          <div className={"CoverList"}>{searchShows}</div>
        </div>
      </div>
    );
  }

  if (type == "episodes") {
    const searchEpisodes = result.episodes?.items.map((item) => {
      return (
        <Card
          key={item.id}
          item={item.id}
          linkTo={`/episode/${item.id}`}
          imageUrl={item.images.length > 0 ? item.images[0].url : ""}
          title={item.name}
          handleRightClick={handleRightClick}
        />
      );
    });

    return (
      <div className={"SearchPageCustom"}>
        <h2 className="Header">Search Episode: &quot;{search}&quot;</h2>
        <div className={"Content"}>
          <div className={"CoverList"}>{searchEpisodes}</div>
        </div>
      </div>
    );
  }
  return <div style={{ overflow: "hidden auto" }}></div>;
}
