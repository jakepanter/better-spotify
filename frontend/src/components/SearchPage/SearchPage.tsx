import React, { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import "../../cards.scss";
import './SearchPage.scss';
import { Link } from "react-router-dom";
import { CheckUsersSavedTracksResponse, SearchResponse } from "spotify-types";
import { useParams } from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from '../../helpers/api-helpers';

export default function SearchPage() {
    let params = useParams() as { search: string };
    const search = params.search;

    const [result, setSearchResult] = useState<SearchResponse>();
    const [tracksSaved, setSaved] = useState<CheckUsersSavedTracksResponse>();

    async function fetchSearchResult() {
        const authHeader = getAuthHeader();
        const data: SearchResponse = await fetch(
            `${API_URL}api/spotify/search?query=${search}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        
        setSearchResult(data);
        
        if(data.tracks?.items && data.tracks.items.length > 0)
        {
          const trackIds = data.tracks?.items.map((i => i.id))
          //Check if tracks of search results are saved by User
          const saved = await fetch(
            `${API_URL}api/spotify/me/tracks/contains?trackIds=${(trackIds)}`, {
                headers: {
                  'Authorization': authHeader
                }
              }
          ).then((res) => res.json());     
          
          setSaved(saved);
        }
    }
    
    useEffect(() => {
        fetchSearchResult();
    }, [search]);

    
    if (!result) return <p></p>;
    
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
              <Link to={`/customsearch/artists/${search}`}>View More</Link>
          </div>
          <div className={"searchPage overview"}>
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
            <Link to={`/customsearch/albums/${search}`}>View More</Link>
        </div>
        <div className={"overview searchPage"}>
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
            <Link to={`/playlist/${item.id}`}>
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
            <Link to={`/customsearch/playlists/${search}`}>View More</Link>
        </div>
        <div className={"overview searchPage"}>
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
            <Link to={`/customsearch/shows/${search}`}>View More</Link>
        </div>
        <div className={"overview searchPage"}>
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
              <Link to={`/customsearch/episodes/${search}`}>View More</Link>
          </div>
          <div className={"overview searchPage"}>
              <ul className={"overview-items"}
                  style={{height: '37vh', overflow: 'hidden'}}>{Episodes}</ul>
          </div>
      </div>
    } 
    else {
      searchEpisodes = null;
    }

    let Tracks, searchTracks;
    if(result.tracks?.items && result.tracks.items.length > 0 && tracksSaved) {
      Tracks = (
        <TrackList
          fullyLoaded = {true}
          type={"search"}
          tracks={result.tracks.items.slice(0, 9)}
          loadMoreCallback={() => null}
          id_tracklist={search}
          is_saved={tracksSaved?.slice(0, 9)}
        />
      );

      searchTracks = 
      <div className={'section'}>  
        <div className={'header'}>
            <h3>Tracks</h3>
            <Link to={`/customsearch/${"tracks"}/${search}`}>View More</Link>
        </div>
        <div className={"overview searchPage"} style={{marginTop: '3vh'}}>
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
        <div className={"overview searchPage"}>
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
