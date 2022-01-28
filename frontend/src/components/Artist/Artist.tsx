import React, {Component} from "react";
import {
    TrackObjectFull,
    SingleArtistResponse,
    ArtistObjectFull,
    AlbumObjectSimplified,
    ArtistsTopTracksResponse,
    ArtistsAlbumsResponse
} from "spotify-types";
import {API_URL} from "../../utils/constants";
import {NavLink, Link} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Artist.scss"
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from '../../helpers/api-helpers';


interface IProps {
    id: string;
}

interface IState {
    artist: ArtistObjectFull;
    artistTopTracks: TrackObjectFull[];
    albums: AlbumObjectSimplified[];
    singles: AlbumObjectSimplified[];
    appearsOn: AlbumObjectSimplified[];
    compilations: AlbumObjectSimplified[];
    relatedArtists: ArtistObjectFull[];
    filter: string
}


class Artist extends Component<IProps, IState> {

    // to check if a component is mounted, following source is used to achieve that: https://stackoverflow.com/questions/39767482/is-there-a-way-to-check-if-the-react-component-is-unmounted
    private _isMounted: boolean;
    constructor(props: IProps) {
        super(props);
        this.state = {
            artist: {} as ArtistObjectFull,
            artistTopTracks: [],
            albums: [],
            singles: [],
            appearsOn: [],
            compilations: [],
            relatedArtists: [],
            filter: "All"
        };
        this._isMounted = false;
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        const authHeader = getAuthHeader();
        // fetch artist
        const artistData: SingleArtistResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState({artist: artistData});

        //fetch artist top tracks
        const topTracks: ArtistsTopTracksResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/top-tracks`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState({artistTopTracks: topTracks.tracks});

        // fetch albums
        const allAlbums: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=album`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState((state) => ({...state, albums: allAlbums.items}));


        // fetch singles
        const allSingles: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=single`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState((state) => ({...state, singles: allSingles.items}));


        // fetch albums where the artist appears on
        const allAppearsOn: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=appears_on`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState((state) => ({...state, appearsOn: allAppearsOn.items}));


        // fetch compilations
        const allCompilations: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=compilation`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState((state) => ({...state, compilations: allCompilations.items}));


        // fet related artists
        const allRelatedArtists = await fetch(
            `${API_URL}api/spotify/artists/${this.props.id}/related-artists`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        this._isMounted && this.setState((state) => ({...state, relatedArtists: allRelatedArtists.artists.slice(0,5)}))


    }

    // this function will be called, when the user clicks on a filter
    handleFilterChange(value: string) {
        //the value of the filter-option will be set
        this.setState({filter: value});
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }


    render() {
        if (Object.keys(this.state.artist).length === 0) return <p>Artist not found</p>;
        const artist = <div>
            {this.state.artist.images.length > 0 ? (
                <div
                    className={"cover"}
                    style={{backgroundImage: `url(${this.state.artist.images[0].url}`}}
                />
            ) : (
                <CoverPlaceholder/>
            )}
            <p className={"artists-name"}>{this.state.artist.name}</p>
        </div>;

        // for albums
        const albums = this.state.albums.map((album, index) => {
            return (
                <li className={"column"} key={album.id + index}>
                    <Link to={`/album/${album.id}`}>
                        {album.images.length > 0 ? (
                            <div
                                className={"cover"}
                                style={{backgroundImage: `url(${album.images[0].url}`}}
                            />
                        ) : (
                            <CoverPlaceholder/>
                        )}
                        <span className={"title"}>{album.name}</span>
                        <span className={"artists-name"}>
                            {album.artists.map((a) => a.name).join(", ")}
                        </span>
                    </Link>
                </li>
            );
        });

        // for singles
        const singles = this.state.singles.map((single, index) => {
            return (
                <li className={"column"} key={single.id + index}>
                    <Link to={`/album/${single.id}`}>
                        {single.images.length > 0 ? (
                            <div
                                className={"cover"}
                                style={{backgroundImage: `url(${single.images[0].url}`}}
                            />
                        ) : (
                            <CoverPlaceholder/>
                        )}
                        <span className={"title"}>{single.name}</span>
                        <span className={"artists-name"}>
                                    {single.artists.map((a) => a.name).join(", ")}
                                </span>
                    </Link>
                </li>
            );
        });

        // fetch albums where the artist appears on
        const appearsOnAlbum = this.state.appearsOn.map((album, index) => {
            return (
                <li className={"column"} key={album.id + index}>
                    <Link to={`/album/${album.id}`}>
                        {album.images.length > 0 ? (
                            <div
                                className={"cover"}
                                style={{backgroundImage: `url(${album.images[0].url}`}}
                            />
                        ) : (
                            <CoverPlaceholder/>
                        )}
                        <span className={"title"}>{album.name}</span>
                        <span className={"artists-name"}>
                            {album.artists.map((a) => a.name).join(", ")}
                        </span>
                    </Link>
                </li>
            );
        });

        // for compilations
        const compilations = this.state.compilations.map((compilation, index) => {
            return (
                <li className={"column"} key={compilation.id + index}>
                    <Link to={`/album/${compilation.id}`}>
                        {compilation.images.length > 0 ? (
                            <div
                                className={"cover"}
                                style={{backgroundImage: `url(${compilation.images[0].url}`}}
                            />
                        ) : (
                            <CoverPlaceholder/>
                        )}
                        <span className={"title"}>{compilation.name}</span>
                        <span className={"artists-name"}>
                            {compilation.artists.map((a) => a.name).join(", ")}
                        </span>
                    </Link>
                </li>
            );
        });

        // for related artists
        const relatedArtists = this.state.relatedArtists.map((relatedArtist) => {
            return (
                <li className="column" key={relatedArtist.id}>
                    <Link to={`/artist/${relatedArtist.id}`}>
                        {relatedArtist.images[0] !== undefined ? (
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

        return (
            <div style={{overflow: "hidden auto"}} key={this.props.id}>

                {/*Filter*/}
                <div className="select">
                    <select className={"input-select"} onChange={(e) => {
                        this.handleFilterChange(e.target.value)
                    }}>
                        <option value="All">Filter: All</option>
                        {this.state.artistTopTracks.length > 0 ? (
                            <option value="Discography">Discography</option>) : (<></>)}
                        {albums.length > 0 ? (
                            <option value="Albums">Albums</option>) : (<></>)}
                        {singles.length > 0 ? (
                            <option value="Singles">Singles</option>) : (<></>)}
                        {appearsOnAlbum.length > 0 ? (
                            <option value="Appears-On">Appears On</option>) : (<></>)}
                        {compilations.length > 0 ? (
                            <option value="Compilations">Compilations</option>) : (<></>)}
                        {relatedArtists.length > 0 ? (
                            <option value="More-like">More like {this.state.artist.name}</option>) : (<></>)}
                    </select>
                </div>

                {/*Artist information*/}
                <div className={"artist"}>
                    <h1 className={"titleName"}>Artist</h1>
                    {artist}
                </div>

                {/*Discography - top tracks*/}
                {(this.state.filter === "Discography" || this.state.filter == "All") && this.state.artistTopTracks ? (
                        <div className={"section"}>
                            <div className={"header"}>
                                <h2>Discography
                                    <NavLink to={`/artist/${this.props.id}/discography`} className={"viewMoreLink"}>View Entire
                                        Discography</NavLink>
                                </h2>
                            </div>
                            <TrackList type={"topTracks"} tracks={this.state.artistTopTracks} loadMoreCallback={() => {
                            }} fullyLoaded={true} id_tracklist={''}/>
                        </div>)
                    : (<></>)}

                {/*Albums*/}
                {(this.state.filter === "Albums" || this.state.filter == "All") && albums.length > 0 ? (
                        <div className={"section"} key={"album"}>
                            <div className={"header"}>
                                <h2>Albums</h2>
                                <NavLink to={`/artist/${this.props.id}/albums/album`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview artist-section"}>
                                <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{albums}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Singles*/}
                {(this.state.filter === "Singles" || this.state.filter == "All") && singles.length > 0 ? (
                        <div className={"section"} key={"singles"}>
                            <div className={"header"}>
                                <h2>Singles</h2>
                                <NavLink to={`/artist/${this.props.id}/albums/single`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview artist-section"}>
                                <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{singles}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Appears On*/}
                {(this.state.filter === "Appears-On" || this.state.filter == "All") && appearsOnAlbum.length > 0 ? (
                        <div className={"section"} key="appearsOn">
                            <div className={"header"}>
                                <h2>Appears on</h2>
                                <NavLink to={`/artist/${this.props.id}/albums/appears_on`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview artist-section"}>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{appearsOnAlbum}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Compilations*/}
                {(this.state.filter === "Compilations" || this.state.filter == "All") && compilations.length > 0 ? (
                        <div className={"section"} key="compilations">
                            <div className={"header"}>
                                <h2>Compilations</h2>
                                <NavLink to={`/artist/${this.props.id}/albums/compilation`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview artist-section"}>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{compilations}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*More like "Artist"*/}
                {(this.state.filter === "More-like" || this.state.filter == "All") && relatedArtists.length > 0 ? (
                        <div className={"section"}>
                            <div className={"header"}>
                                <h2>More like &quot;{this.state.artist.name}&quot;</h2>
                                <NavLink to={`/related-artists/${this.props.id}`}>View
                                    More</NavLink>
                            </div>
                            <div className={"overview artist-section"}>
                                <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>
                                    {relatedArtists}
                                </ul>
                            </div>
                        </div>)
                    : (<></>)}
            </div>
        );
    }
}

export default Artist;