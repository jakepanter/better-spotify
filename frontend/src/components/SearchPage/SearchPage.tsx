import React, { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import "../../cards.scss";
import './SearchPage.scss';
import { Link } from "react-router-dom";
import { SearchResponse } from "spotify-types";
import { useParams } from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";

export default function SearchPage() {
    let params = useParams() as { search: string };
    const search = params.search;

    const [result, setSearchResult] = useState<SearchResponse>()

    async function fetchSearchResult() {
        const data: SearchResponse = await fetch(
            `${API_URL}api/spotify/search?query=${search}`
        ).then((res) => res.json());
        
        setSearchResult(data);
    }

    useEffect(() => {
        fetchSearchResult();
    }, [search]);

    if (!result) return <p>loading...</p>;
    
    let Artists, searchArtists;
    if(result.artists?.items && result.artists.items.length > 0) {
      Artists = result.artists?.items.map((item) => {
        return(
          <li className="column" key={item.id}>
            <Link to={`/album/${item.id}`}>
                {item.images.length > 0 ? (
                  <div
                    className={"cover"}
                    style={{ backgroundImage: `url(${item.images[0].url}` }}
                  />
                ) : (
                  <CoverPlaceholder />
                )}
                <span className="title">{item.name}</span>
            </Link>
          </li>
        )  
      });

      searchArtists = 
        <div className={"section"}>
          <div className={'header'}>
              <h3>Artists</h3>
              <Link to={"/"}>View More</Link>
          </div>
          <div className={"overview"}>
              <ul className={"overview-items"}
                  style={{height: '37vh', overflow: 'hidden'}}>{Artists}</ul>
          </div>
      </div>
    } 
    else {
      searchArtists = null;
    }

    let Albums;
    let searchAlbums;
    if(result.albums?.items && result.albums.items.length > 0) {
      Albums = result.albums?.items.map((item) => {
        return(
          <li className="column" key={item.id}>
            <Link to={`/album/${item.id}`}>
                {item.images.length > 0 ? (
                  <div
                    className={"cover"}
                    style={{ backgroundImage: `url(${item.images[0].url}` }}
                  />
                ) : (
                  <CoverPlaceholder />
                )}
                <span className="title">{item.name}</span>
                <span className={"artists-name"}>{item.artists[0].name}</span>
            </Link>
          </li>
        )  
      });

      searchAlbums = 
      <div className={"section"}>
        <div className={'header'}>
            <h3>Albums</h3>
            <Link to={"/"}>View More</Link>
        </div>
        <div className={"overview"}>
            <ul className={"overview-items"}
                style={{height: '40vh', overflow: 'hidden'}}>{Albums}</ul>
        </div>
    </div>
    } 
    else {
      searchAlbums = null;
    }


    let Playlists, searchPlaylists;
    if(result.playlists?.items && result.playlists.items.length > 0) {
      Playlists = result.playlists?.items.map((item) => {
        return(
          <li className="column" key={item.id}>
            <Link to={`/album/${item.id}`}>
                {item.images.length > 0 ? (
                  <div
                    className={"cover"}
                    style={{ backgroundImage: `url(${item.images[0].url}` }}
                  />
                ) : (
                  <CoverPlaceholder />
                )}
                <span className="title">{item.name}</span>
                <span className={"artists-name"}>{item.owner.display_name}</span>
            </Link>
          </li>
        )  
      });

      searchPlaylists = 
      <div className={"section"}>
        <div className={'header'}>
            <h3>Playlists</h3>
            <Link to={"/"}>View More</Link>
        </div>
        <div className={"overview"}>
            <ul className={"overview-items"}
                style={{height: '40vh', overflow: 'hidden'}}>{Playlists}</ul>
        </div>
    </div>
    } 
    else {
      searchPlaylists = null;
    }
    
    
    let Shows, searchShows;
    if(result.shows?.items && result.shows.items.length > 0) {
      Shows = result.shows?.items.map((item) => {
        return(
          <li className="column" key={item.id}>
            <Link to={`/album/${item.id}`}>
                {item.images.length > 0 ? (
                  <div
                    className={"cover"}
                    style={{ backgroundImage: `url(${item.images[0].url}` }}
                  />
                ) : (
                  <CoverPlaceholder />
                )}
                <span className="title">{item.name}</span>
                <span className={"artists-name"}>{item.publisher}</span>
            </Link>
          </li>
        )  
      });

      searchShows = 
      <div className={"section"}>
        <div className={'header'}>
            <h3>Podcasts</h3>
            <Link to={"/"}>View More</Link>
        </div>
        <div className={"overview"}>
            <ul className={"overview-items"}
                style={{height: '40vh', overflow: 'hidden'}}>{Shows}</ul>
        </div>
    </div>
    } 
    else {
      searchShows = null;
    }

    let Episodes, searchEpisodes;
    if(result.episodes?.items && result.episodes.items.length > 0) {
      Episodes = result.episodes?.items.map((item) => {
        return(
          <li className="column" key={item.id}>
            <Link to={`/album/${item.id}`}>
                {item.images.length > 0 ? (
                  <div
                    className={"cover"}
                    style={{ backgroundImage: `url(${item.images[0].url}` }}
                  />
                ) : (
                  <CoverPlaceholder />
                )}
                <span className="title">{item.name}</span>
            </Link>
          </li>
        )  
      });

      searchEpisodes = 
      <div className={"section"}>
          <div className={'header'}>
              <h3>Podcast Episodes</h3>
              <Link to={"/"}>View More</Link>
          </div>
          <div className={"overview"}>
              <ul className={"overview-items"}
                  style={{height: '37vh', overflow: 'hidden'}}>{Episodes}</ul>
          </div>
      </div>
    } 
    else {
      searchEpisodes = null;
    }

    let Tracks, searchTracks;
    if(result.tracks?.items && result.tracks.items.length > 0) {
      Tracks = (
        <TrackList
          fullyLoaded = {true}
          type={"search"}
          tracks={result.tracks.items.slice(0, 9)}
          loadMoreCallback={() =>
            console.log("")
          }
          id_tracklist={search}
        />
      );

      searchTracks = 
      <div className={'section'}>  
        <div className={'header'}>
            <h3>Tracks</h3>
            <Link to={"/"}>View More</Link>
        </div>
        <div className={"overview"} style={{marginTop: '3vh'}}>
          {Tracks}
        </div>
      </div>
    } 
    else {
      searchTracks = null;
    }
    
    return (
      <div style={{ overflow: "hidden auto" }}>
        <h2>Search for &quot;{search}&quot;</h2>
        <div className={"overview"}>
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
