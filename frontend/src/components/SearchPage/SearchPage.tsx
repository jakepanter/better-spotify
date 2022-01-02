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
    
    const header = (<h2>Search: {search}</h2>);

    const searchArtists = result.artists?.items.map((item) => {
      return(
        <li className={"column"} key={item.id}>
          <Link to={`/artist/${item.id}`}>
            {item.images.length > 0 ? (
              <div
                className={"cover"}
                style={{ backgroundImage: `url(${item.images[0].url}` }}
              />
            ) : (
              <CoverPlaceholder />
            )}
            <span className={"title"}>{item.name}</span>
            <span className={"artists-name"}>{item.name}</span>
          </Link>
        </li>
      )  
    })

    const searchAlbums = result.albums?.items.map((item) => {
        return(
          <li className={"column"} key={item.id}>
            <Link to={`/album/${item.id}`}>
              {item.images.length > 0 ? (
                <div
                  className={"cover"}
                  style={{ backgroundImage: `url(${item.images[0].url}` }}
                />
              ) : (
                <CoverPlaceholder />
              )}
              <span className={"title"}>{item.name}</span>
              <span className={"artists-name"}>{item.artists[0].name}</span>
            </Link>
          </li>
      )  
    });
    
    let searchTracks;
    if(result.tracks) {
      searchTracks = (
        <TrackList
          fullyLoaded = {true}
          type={"search"}
          tracks={result.tracks.items}
          loadMoreCallback={() =>
            console.log("")
          }
          id_tracklist={search}
        />
      );
    }
    else {
      searchTracks = "";
    }
    
   

    return (
        <div style={{ overflow: "hidden auto" }}>
          {header}
          <div className={'SearchPage'}> 
            <div className={'SearchPageItem'}>
                {searchTracks}
            </div>
            <div className={'SearchPageItem'}>
              <h2>Artists</h2>
              <div className={"overview"}>
                <ul className={"overview-items"}>{searchArtists}</ul>
              </div>
            </div>
            <div className={'SearchPageItem'}>
              <h2>Albums</h2>
              <div className={"overview"}>
                <ul className={"overview-items"}>{searchAlbums}</ul>
              </div>
            </div>
          </div>
        </div>
    );
}
