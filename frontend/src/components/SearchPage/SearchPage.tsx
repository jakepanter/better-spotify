import React, { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import "../../cards.scss";
import "./SearchPage.scss";
import { Link } from "react-router-dom";
import { CheckUsersSavedTracksResponse, SearchResponse } from "spotify-types";
import { useParams } from "react-router-dom";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

export default function SearchPage() {
  let params = useParams() as { search: string };
  const search = params.search;

  const [result, setSearchResult] = useState<SearchResponse>();
  const [tracksSaved, setSaved] = useState<CheckUsersSavedTracksResponse>();

  async function fetchSearchResult() {
    const authHeader = getAuthHeader();
    const data: SearchResponse = await fetch(`${API_URL}api/spotify/search?query=${search}`, {
      headers: {
        Authorization: authHeader,
      },
    }).then((res) => res.json());

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
  }, [search]);

  if (!result) return <p></p>;

  let Artists, searchArtists;
  if (result.artists?.items && result.artists.items.length > 0) {
    Artists = result.artists?.items.map((item) => {
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

    searchArtists = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Artists
            <Link to={`/customsearch/artists/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"searchPage Content"}>
          <div className={"CoverList"}>{Artists}</div>
        </div>
      </div>
    );
  } else {
    searchArtists = null;
  }

  let Albums;
  let searchAlbums;
  if (result.albums?.items && result.albums.items.length > 0) {
    Albums = result.albums?.items.map((item) => {
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

    searchAlbums = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Albums
            <Link to={`/customsearch/albums/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"Content searchPage"}>
          <div className={"CoverList"}>{Albums}</div>
        </div>
      </div>
    );
  } else {
    searchAlbums = null;
  }

  let Playlists, searchPlaylists;
  if (result.playlists?.items && result.playlists.items.length > 0) {
    Playlists = result.playlists?.items.map((item) => {
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

    searchPlaylists = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Playlists
            <Link to={`/customsearch/playlists/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"Content searchPage"}>
          <ul className={"CoverList"}>{Playlists}</ul>
        </div>
      </div>
    );
  } else {
    searchPlaylists = null;
  }

  let Shows, searchShows;
  if (result.shows?.items && result.shows.items.length > 0) {
    Shows = result.shows?.items.map((item) => {
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

    searchShows = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Podcasts
            <Link to={`/customsearch/shows/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"Content searchPage"}>
          <ul className={"CoverList"}>{Shows}</ul>
        </div>
      </div>
    );
  } else {
    searchShows = null;
  }

  let Episodes, searchEpisodes;
  if (result.episodes?.items && result.episodes.items.length > 0) {
    Episodes = result.episodes?.items.map((item) => {
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

    searchEpisodes = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Podcast Episodes
            <Link to={`/customsearch/episodes/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"Content searchPage"}>
          <ul className={"CoverList"}>{Episodes}</ul>
        </div>
      </div>
    );
  } else {
    searchEpisodes = null;
  }

  let Tracks, searchTracks;
  if (result.tracks?.items && result.tracks.items.length > 0 && tracksSaved) {
    Tracks = (
      <div style={{ margin: "0 1rem" }}>
        <TrackList
          fullyLoaded={true}
          type={"search"}
          tracks={result.tracks.items.slice(0, 9)}
          loadMoreCallback={() => null}
          id_tracklist={search}
          is_saved={tracksSaved?.slice(0, 9)}
        />
      </div>
    );

    searchTracks = (
      <div className={"SearchPage"}>
        <div className={"Header"}>
          <h2>
            Tracks
            <Link to={`/customsearch/${"tracks"}/${search}`} className="ViewMoreLink">
              View More
            </Link>
          </h2>
        </div>
        <div className={"Content searchPage"}>{Tracks}</div>
      </div>
    );
  } else {
    searchTracks = null;
  }

  return (
    <div style={{ overflow: "hidden auto" }}>
      <h2>Search for &quot;{search}&quot;</h2>
      <div>
        {searchTracks}
        {searchAlbums}
        {searchArtists}
        {searchPlaylists}
        {searchShows}
        {searchEpisodes}
      </div>
    </div>
  );
}
