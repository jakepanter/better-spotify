import React, {Component} from 'react';
import {
    PlayHistoryObject,
    UsersRecentlyPlayedTracksResponse,
    AlbumObjectSimplified,
    TrackObjectFull,
    ArtistObjectFull,
    ListOfNewReleasesResponse
} from "spotify-types";
import './Discover.scss';
import "../../cards.scss";
import {API_URL} from "../../utils/constants";
import {NavLink, Link} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import {formatTimeDiff} from "../../utils/functions";
import { getAuthHeader } from '../../helpers/api-helpers';

interface IProps {
}

interface IState {
    // recently played tracks are stored
    recentlyPlayedTracks: PlayHistoryObject[];
    // new releases are stored
    newReleases: AlbumObjectSimplified[];
    // artist and their related artists are stored
    relatedArtistsList: {
        "artist": ArtistObjectFull,
        "relatedArtists": ArtistObjectFull[],
    }[];
}


const limit = 5;

class Discover extends Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);

        this.state = {
            recentlyPlayedTracks: [],
            newReleases: [],
            relatedArtistsList: []
        };
    }


    async componentDidMount() {

        // fetch reently played tracks
        this.fetchRecentlyPlayedTracks().then((recentPlayedTracksData) => {
            // Save to state
            this.setState((state) => ({...state, recentlyPlayedTracks: recentPlayedTracksData.items}));
        });

        // get users country
        const authHeader = getAuthHeader();
        const me = await fetch(
            `${API_URL}api/spotify/me`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        const country = me.country;

        // fetch new releases
        this.fetchNewReleases(country).then((newReleasedAlbums) => {
            this.setState((state) => ({...state, newReleases: newReleasedAlbums.albums.items}));
        });

        // fetch related artist of top three artists
        this.fetchTopArtists().then((topArtists) => {
            //slice top three artists
            const topThreeArtists: ArtistObjectFull[] = topArtists.items.sort(() => 0.5 - Math.random()).slice(0, 3);
            topThreeArtists.map((topArtist) => {
                this.fetchRelatedArtists(topArtist.id).then((relatedArtists) => {
                        const fiveRelatedArtists = relatedArtists.artists.sort(() => 0.5 - Math.random()).slice(0, 5);
                        const list = {
                            "artist": topArtist,
                            "relatedArtists": fiveRelatedArtists
                        };
                        this.setState({relatedArtistsList: [...this.state.relatedArtistsList, list]});
                    }
                )
            });
        });
    }

    async fetchRecentlyPlayedTracks() {
        const authHeader = getAuthHeader();
        const res = await fetch(
            `${API_URL}api/spotify/player/recently-played?limit=${limit}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        );
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await res.json();
        return recentPlayedTracksData;
    }

    async fetchNewReleases(country: string) {
        const authHeader = getAuthHeader();
        const res = await fetch(
            `${API_URL}api/spotify/browse/new-releases?country=${country}&limit=${limit}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        );
        const newReleasedAlbums: ListOfNewReleasesResponse = await res.json();
        return newReleasedAlbums;
    }


    async fetchTopArtists() {
        const authHeader = getAuthHeader();
        // Fetch top artists
        const res = await fetch(
            `${API_URL}api/spotify/me/top/artists`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        );
        const topArtists = await res.json();
        return topArtists;
    }

    async fetchRelatedArtists(artistId: string) {
        const authHeader = getAuthHeader();
        const res = await fetch(
            `${API_URL}api/spotify/artists/${artistId}/related-artists`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        );
        const relatedArtists = await res.json();
        return relatedArtists;
    }

    render() {
        // for recently played tracks
        if (this.state.recentlyPlayedTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentlyPlayedTracks.map((recentlyPlayedTrack) => {
            const track = recentlyPlayedTrack.track as TrackObjectFull;
            return (
                <li className={"column"} key={recentlyPlayedTrack.played_at}>
                    <Link to={`/album/${track.album.id}`}>
                        {track.album.images !== undefined ? (
                            <div className={"cover"} style={{
                                backgroundImage: `url(${track.album.images[0].url})`
                            }}>
                            </div>) : (
                                <CoverPlaceholder/>
                                )}
                        <span className={"title"}>{track.name}</span>
                        <span className={"artists-name"}>{track.album.artists.map((a) => a.name).join(", ")}</span>
                    </Link>
                </li>
            );
        });

        // for new releases
        if (this.state.newReleases.length === 0) return <p>loading...</p>;
        const releases = this.state.newReleases.map((newReleasedAlbum) => {
            return (
                <li className="column" key={newReleasedAlbum.id}>
                    <Link to={`/album/${newReleasedAlbum.id}`}>
                        {newReleasedAlbum.images !== undefined ? (
                        <div className={"cover"} style={{
                            backgroundImage: `url(${newReleasedAlbum.images[0].url})`
                        }}>
                        </div>) :
                            ( <CoverPlaceholder/>)}
                        <span className={"title"}>{newReleasedAlbum.name}</span>
                        <span className={"artists-name"}>{newReleasedAlbum.artists.map((a) => a.name).join(", ")}</span>
                        <span className={"added-at"}>{formatTimeDiff(new Date(newReleasedAlbum.release_date).getTime(), Date.now())}</span>
                    </Link>
                </li>
            );
        });

        //for related artists
        if (this.state.relatedArtistsList.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.relatedArtistsList.map((relatedArtistsListItem) => {
            const relatedArtistsForOneArtist = relatedArtistsListItem.relatedArtists.map((relatedArtist) => {
                return (
                    <li className="column" key={relatedArtist.id}>
                        <Link to={`/artist/${relatedArtist.id}`}>
                            {relatedArtist.images !== undefined ? (
                                <div className={"cover"} style={{
                                    backgroundImage: `url(${relatedArtist.images[0].url})`
                                }}>
                                </div>
                            ) : (
                                <CoverPlaceholder/>
                                )}

                            <span className="title">{relatedArtist.name}</span>
                        </Link>
                    </li>
                );
            });
            return relatedArtistsForOneArtist;
        });

        return (
            <>
                <h2>Discover</h2>
                <div style={{overflow: 'hidden auto'}}>
                    {/*Recently Played Tracks*/}
                    <div className={"section"} key="recentlyPlayed">
                        <div className={'header discover-font-adjustment'}>
                            <h3>Recently listened to</h3>
                            <NavLink to={"/song-history"}>View More</NavLink>
                        </div>
                        <div className={"overview"}>
                            <ul className={"overview-items"}
                                style={{height: '40vh', overflow: 'hidden'}}>{recentlyPlayedList}</ul>
                        </div>
                    </div>

                    {/*New Releases*/}
                    <div className={"section"} key="newReleases">
                        <div className={'header discover-font-adjustment'}>
                            <h3>New Releases</h3>
                            <NavLink to={"/new-releases"}>View More</NavLink>
                        </div>
                        <div className={"overview"}>
                            <ul className={"overview-items"}
                                style={{height: '40vh', overflow: 'hidden'}}>{releases}</ul>
                        </div>
                    </div>

                    {/*More like "artist"*/}
                    {relatedArtists.map((tmp, index) =>
                        <div className={"section"} key={this.state.relatedArtistsList[index].artist.id}>
                            <div className={"overview"} key={this.state.relatedArtistsList[index].artist.id}>
                                <div className={'header discover-font-adjustment'}>
                                    <h3>More like &quot;{this.state.relatedArtistsList[index].artist.name}&quot;</h3>
                                    <NavLink to={`/related-artists/${this.state.relatedArtistsList[index].artist.id}`}>View
                                        More</NavLink>
                                </div>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{tmp}</ul>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default Discover;