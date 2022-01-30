import React, {  useState, useEffect} from "react";
import { API_URL } from "../../../utils/constants";
import "../../../cards.scss";
import { CheckUsersSavedTracksResponse, SearchResponse } from "spotify-types";
import { useParams } from "react-router-dom";
import CoverPlaceholder from "../../CoverPlaceholder/CoverPlaceholder";
import { Link } from "react-router-dom";
import TrackList from "../../TrackList/TrackList";
import { getAuthHeader } from '../../../helpers/api-helpers';


export default function SearchPageCustom() {
    let params = useParams() as { type: string, search: string };
    const search = params.search;
    const type = params.type;
    const [result, setSearchResult] = useState<SearchResponse>()
    const [tracksSaved, setSaved] = useState<CheckUsersSavedTracksResponse>();

    async function fetchSearchResult() {
        const authHeader = getAuthHeader();
        const data: SearchResponse = await fetch(
            `${API_URL}api/spotify/customsearch?type=${type}&search=${search}`, {
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
    }, [type]);

    if (!result) return <p></p>;

    if(type == 'tracks') {
        if(result.tracks?.items && result.tracks.items.length > 0 && tracksSaved) {
            const searchTracks = (
                <TrackList
                fullyLoaded = {true}
                type={"search"}
                tracks={result.tracks?.items}
                loadMoreCallback={() => null}
                id_tracklist={search}
                is_saved={tracksSaved}
                />
            );
        
            return (
                <div style={{ overflow: "hidden auto" }}>
                    <h2>Search Tracks: &quot;{search}&quot;</h2>
                    <div className={"overview"} >
                        <ul className={"overview-items"}>{searchTracks}</ul>
                    </div>
                </div>
            );
        }
    } 
    
    if(type == 'albums') {
        const searchAlbums = result.albums?.items.map((item) => {
            return (
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
            );
        });
              
        return (
            <div style={{ overflow: "hidden auto" }}>
                <h2>Search Album: &quot;{search}&quot;</h2>
                <div className={"overview"} >
                    <ul className={"overview-items"}>{searchAlbums}</ul>
                </div>
            </div>
        )
    }

    if(type == 'playlists') {
        const searchPlaylists = result.playlists?.items.map((item) => {
            return (
              <li className={"column"} key={item.id}>
                <Link to={`/playlist/${item.id}`}>
                  {item.images.length > 0 ? (
                    <div
                      className={"cover"}
                      style={{ backgroundImage: `url(${item.images[0].url}` }}
                    />
                  ) : (
                    <CoverPlaceholder />
                  )}
                  <span className={"title"}>{item.name}</span>
                  <span className={"artists-name"}>{item.owner.display_name}</span>
                </Link>
              </li>
            );
        });
              
        return (
            <div style={{ overflow: "hidden auto" }}>
                <h2>Search Playlist: &quot;{search}&quot;</h2>
                <div className={"overview"} >
                    <ul className={"overview-items"}>{searchPlaylists}</ul>
                </div>
            </div>
        )
    }

    if(type == 'artists') {
        const searchArtists = result.artists?.items.map((item) => {
            return (
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
                </Link>
              </li>
            );
        });
              
        return (
            <div style={{ overflow: "hidden auto" }}>
                <h2>Search Artist: &quot;{search}&quot;</h2>
                <div className={"overview"} >
                    <ul className={"overview-items"}>{searchArtists}</ul>
                </div>
            </div>
        )
    }

    if(type == 'shows') {
        const searchShows = result.shows?.items.map((item) => {
            return (
              <li className={"column"} key={item.id}>
                <Link to={`/show/${item.id}`}>
                  {item.images.length > 0 ? (
                    <div
                      className={"cover"}
                      style={{ backgroundImage: `url(${item.images[0].url}` }}
                    />
                  ) : (
                    <CoverPlaceholder />
                  )}
                  <span className={"title"}>{item.name}</span>
                  <span className={"artists-name"}>{item.publisher}</span>
                </Link>
              </li>
            );
        });
              
        return (
            <div style={{ overflow: "hidden auto" }}>
                <h2>Search Podcast: &quot;{search}&quot;</h2>
                <div className={"overview"} >
                    <ul className={"overview-items"}>{searchShows}</ul>
                </div>
            </div>
        )
    }

    if(type == 'episodes') {
        const searchEpisodes = result.episodes?.items.map((item) => {
            return (
              <li className={"column"} key={item.id}>
                <Link to={`/episode/${item.id}`}>
                  {item.images.length > 0 ? (
                    <div
                      className={"cover"}
                      style={{ backgroundImage: `url(${item.images[0].url}` }}
                    />
                  ) : (
                    <CoverPlaceholder />
                  )}
                  <span className={"title"}>{item.name}</span>
                </Link>
              </li>
            );
        });
              
        return (
            <div style={{ overflow: "hidden auto" }}>
                <h2>Search Episode: &quot;{search}&quot;</h2>
                <div className={"overview"} >
                    <ul className={"overview-items"}>{searchEpisodes}</ul>
                </div>
            </div>
        )
    }
    return (
        <div style={{ overflow: "hidden auto" }}>
        </div>
    );
}


