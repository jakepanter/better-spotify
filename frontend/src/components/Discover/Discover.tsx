import React, {Component} from 'react';
import {
    PlayHistoryObject,
    UsersRecentlyPlayedTracksResponse,
    AlbumObjectSimplified,
    TrackObjectFull,
    ArtistObjectFull,
    ListOfNewReleasesResponse,
    UsersTopArtistsResponse
} from "spotify-types";
import './Discover.scss';
import "../../cards.scss";
import {API_URL} from "../../utils/constants";
import {NavLink, Link} from "react-router-dom";

//TODO
// Filter vor available country? for new releases

interface IProps {}

interface IState {
    // for recently played tracks
    recentlyPlayedTracks: PlayHistoryObject[];
    //for new releases
    newReleases: AlbumObjectSimplified[];
    // for storing users 20 top artists
    topArtists: ArtistObjectFull[];

    //for storing all related artists for each top artist
    relatedArtistsList: ArtistObjectFull[][];

    topArtistsName: string[];
    topThreeArtists: ArtistObjectFull[];
}

class Discover extends Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);

        this.state = {
            recentlyPlayedTracks: [],
            newReleases: [],
            topArtists: [],
            relatedArtistsList: [],
            topArtistsName: [],
            topThreeArtists: []
        };
    }

    async componentDidMount() {
        // Fetch recently played tracks
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?limit=5`
        ).then((res) => res.json());

        // Save to state
        this.setState((state) => ({...state, recentlyPlayedTracks: recentPlayedTracksData.items}));

        // Fetch new releases
        const newReleasedAlbums: ListOfNewReleasesResponse = await fetch(
            `${API_URL}api/spotify/browse/new-releases?limit=5`
        ).then((res) => res.json());
        this.setState((state) => ({...state, newReleases: newReleasedAlbums.albums.items}));

        // Fetch top artists
        const myTopArtists: UsersTopArtistsResponse = await fetch(
            `${API_URL}api/spotify/me/top/artists`
        ).then((res) => res.json());
        this.setState((state) => ({...state, topArtists: myTopArtists.items}));
        console.log("-----------------");
        console.log(this.state.topArtists);

        // Get top three artists
        this.setState({topThreeArtists: this.state.topArtists.sort(() => 0.5 - Math.random()).slice(0, 3)});

        // Fetch related artists for each top artist
        this.state.topThreeArtists.map(async (artist) => {
            const relatedArtists = await fetch(
                `${API_URL}api/spotify/artists/${artist.id}/related-artists`
            ).then((res) => res.json());
            //store related artist in artistsList
            await this.setState({relatedArtistsList: [...this.state.relatedArtistsList, relatedArtists.artists]});
            await this.setState({topArtistsName: [...this.state.topArtistsName, artist.name]});
            //store name
            console.log(this.state.topThreeArtists)
        });
    }

    render() {
        // for recently played tracks
        if (this.state.recentlyPlayedTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentlyPlayedTracks.map((recentlyPlayedTrack) => {
            const track = recentlyPlayedTrack.track as TrackObjectFull;
            return (
                <li className={"column"} key={recentlyPlayedTrack.played_at}>
                    <Link to={`/album/${track.album.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${track.album.images[0].url})`
                        }}>
                        </div>
                        <span className={"title"}>{track.name}</span>
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
                        <div className={"cover"} style={{
                            backgroundImage: `url(${newReleasedAlbum.images[0].url})`
                        }}>
                        </div>
                        <span className="title">{newReleasedAlbum.name}</span>
                    </Link>
                </li>
            );
        });

        // for more like 'artist'
        if (this.state.relatedArtistsList.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.relatedArtistsList.map((artists) => {
            const fiveArtists = artists.slice(0, 5);
            // for each top artist, the five related artists are stored in elements
            const elements = fiveArtists.map((artist) => {
                    return (
                        <li className="column" key={artist.id}>
                            <Link to={`/artist/${artist.id}`}>
                                <div className={"cover"} style={{
                                    backgroundImage: `url(${artist.images[0].url})`
                                }}>
                                </div>
                                <span className="title">{artist.name}</span>
                            </Link>
                        </li>
                    );
                }
            );
            return (elements);
        });

        return (
            <>
                <h2>Discover</h2>
                <div style={{overflow: 'hidden auto'}}>
                    {/*Recently Played Tracks*/}
                    <div className={"section"} key="recentlyPlayed">
                        <div className={'header'}>
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
                        <div className={'header'}>
                        <h3>New Releases</h3>
                        <NavLink to={"/new-releases"}>View More</NavLink>
                        </div>
                        <div className={"overview"}>
                            <ul className={"overview-items"}
                                style={{height: '40vh', overflow: 'hidden'}}>{releases}</ul>
                        </div>
                    </div>

                    {/*More like "artist"*/}
                    <div className={"section"} key="relatedArtists">
                        {relatedArtists.map((artists, index) =>
                            <div className={"overview"} key={this.state.topArtistsName[index]}>
                                <div className={'header'}>
                                <h3>More like &quot;{this.state.topArtistsName[index]}&quot;</h3>
                                <NavLink to={`/related-artists/${this.state.topThreeArtists[index].id}`}>View More</NavLink>
                                </div>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{artists}</ul>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

export default Discover;