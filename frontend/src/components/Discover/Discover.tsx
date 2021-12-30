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

//TODO
// Filter vor available country? for new releases

interface IProps {
}

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
    //listen array
    test: {
        "artist": ArtistObjectFull,
        "relatedArtists": ArtistObjectFull[],
    }[];
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
            topThreeArtists: [],
            test: []
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

        console.log("--------------fetch top artists-------------------");
        this.fetchTopArtists().then((topArtists) => {
            console.log(topArtists);
            //slice top three artists
            const topThreeArtists: ArtistObjectFull[] = topArtists.items.sort(()=> 0.5-Math.random()).slice(0,3);
            topThreeArtists.map ((topArtist) =>{
                this.fetchRelatedArtists(topArtist.id).then((relatedArtists) => {
                        console.log(topArtist.name);
                        // TODO
                        // shuffle??????
                        const fiveRelatedArtists = relatedArtists.artists.slice(0,5);
                        console.log(fiveRelatedArtists);
                        const list = {
                            "artist": topArtist,
                            "relatedArtists": fiveRelatedArtists
                        };
                        this.setState({test: [...this.state.test, list]});
                        console.log(this.state.test);
                    }
                )
            });
        });

        /*//slice 3 top artists
        this.setState((state) => ({...state, topThreeArtists: myTopArtists.items.sort(()=> 0.5-Math.random()).slice(0,3)}));
        //console.log(myTopArtists);

        //fetche related artists und packe artist und related artists in ein Object -key-value Array
        const tmp = await this.state.topThreeArtists.map(async (artist) => {
            const a = await fetch(
                `${API_URL}api/spotify/artists/${artist.id}/related-artists`
            ).then((res) => {
                return ({
                        "artist": artist,
                        "related-artists": res.json();
                    }
                );
            });

        });
        await this.setState(  (state) => ({...state, test: a}));
        console.log( await this.state.test);
*/
    }


    async fetchTopArtists() {
        // Fetch top artists
        const res = await fetch(
            `${API_URL}api/spotify/me/top/artists`
        );
        const topArtists = await res.json();
        return topArtists;
    }

    async fetchRelatedArtists(artistId: string) {
        const res = await fetch(
            `${API_URL}api/spotify/artists/${artistId}/related-artists`
        );
        const relatedArtists = await res.json();
        return relatedArtists;
    }

    render() {

        /*if (this.state.artistsList.length === 0) return <p>loading...</p>;
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
        });*/

        if (this.state.test.length === 0) return <p>loading...</p>;
        //[[],[],[]]
        const relatedArtists = this.state.test.map((testObject) => {
            console.log(testObject);
            const relatedArtistsForOneArtist = testObject.relatedArtists.map((relatedArtist) => {
                return (
                    <li className="column" key={relatedArtist.id}>
                        <Link to={`/artist/${relatedArtist.id}`}>
                            <div className={"cover"} style={{
                                backgroundImage: `url(${relatedArtist.images[0].url})`
                            }}>
                            </div>
                            <span className="title">{relatedArtist.name}</span>
                        </Link>
                    </li>
                );
            })
            return relatedArtistsForOneArtist;
        });

        /*if (this.state.test.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.test[0].relatedArtists.map((relatedArtist) => {
            return (
                <li className="column" key={relatedArtist.id}>
                    <Link to={`/artist/${relatedArtist.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${relatedArtist.images[0].url})`
                        }}>
                        </div>
                        <span className="title">{relatedArtist.name}</span>
                    </Link>
                </li>
            );
        });
*/
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
                    {relatedArtists.map((tmp,index)=>
                   <div className={"section"} key={this.state.test[index].artist.id}>
                            <div className={"overview"} key={this.state.test[index].artist.id}>
                                <div className={'header'}>
                                    <h3>More like &quot;{this.state.test[index].artist.name}&quot;</h3>
                                    <NavLink to={`/related-artists/${this.state.test[index].artist.id}`}>View
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