import React, {Component} from 'react';
import {
    PlayHistoryObject,
    UsersRecentlyPlayedTracksResponse,
    AlbumObjectSimplified,
    TrackObjectFull,
    ArtistObjectFull,
    ListOfNewReleasesResponse,
    UsersTopArtistsResponse,
    ArtistsRelatedArtistsResponse
} from "spotify-types";
import './Discover.scss';
import "../../cards.scss";
import {API_URL} from "../../utils/constants";
import {NavLink, Link} from "react-router-dom";

//TODO
// Filter vor available country? for new releases

interface IProps {}

interface IState {
    recentTracks: PlayHistoryObject[];
    newReleases: AlbumObjectSimplified[];
    topArtists: ArtistObjectFull[];
    artistsList: ArtistObjectFull[][];
    topArtistsName: string[];
}

class Discover extends Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);

        this.state = {
            recentTracks: [],
            newReleases: [],
            topArtists: [],
            artistsList: [],
            topArtistsName: []
        };
    }

    async componentDidMount() {
        // Fetch recently played tracks
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?limit=5`
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, recentTracks: recentPlayedTracksData.items}));

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

        // Get top three artists
        const topThreeArtists = this.state.topArtists.sort(() => 0.5 - Math.random()).slice(0, 3);

        // Fetch related artists for each top artist
        topThreeArtists.map(async (artist) => {
            const relatedArtists: ArtistsRelatedArtistsResponse = await fetch(
                `${API_URL}api/spotify/artists/${artist.id}/related-artists`
            ).then((res) => res.json());
            this.setState({artistsList: [...this.state.artistsList, relatedArtists.artists]});
            //store name
            this.setState({topArtistsName: [...this.state.topArtistsName, artist.name]});
        });
    }

    render() {
        if (this.state.artistsList.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.artistsList.map((artists) => {
            const fiveArtists = artists.slice(0, 5);
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

        if (this.state.recentTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentTracks.map((recentlyPlayedTrack) => {
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


        return (
            <>
                <h2>Discover</h2>
                <div style={{overflow: 'hidden auto'}}>
                {/*Recently Played Tracks*/}
                <div className={"recentlyPlayedTrackList"} key = "recentlyPlayed">
                    <h3>Recently listened to</h3>
                    <NavLink to={"/song-history"} className="button">View More</NavLink>
                    <div className={"overview"}>
                        <ul className={"overview-items"}
                            style={{height: '40vh', overflow: 'hidden'}}>{recentlyPlayedList}</ul>
                    </div>
                </div>

                {/*More like "artist"*/}
                <div className={"relatedArtists"} key = "relatedArtists">
                    {relatedArtists.map((artists, index) =>
                        <div className={"overview"} key={this.state.topArtistsName[index]}>
                            <h3>More like &quot;{this.state.topArtistsName[index]}&quot;</h3>
                            <NavLink to={`/related-artists/${this.state.topArtists[index].id}` } className="button">View More</NavLink>
                            <ul className={"overview-items"}
                                style={{height: '40vh', overflow: 'hidden'}}>{artists}</ul>
                        </div>
                    )}
                </div>

                {/*New Releases*/}
                <div className={"newReleases"} key = "newReleases2">
                    <h3>New Releases</h3>
                    <NavLink to={"/new-releases"} className="button" id="viewMoreButton">View More</NavLink>
                    <div className={"overview"}>
                        <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{releases}</ul>
                    </div>
                </div>
                </div>
            </>
        );
    }
}

export default Discover;