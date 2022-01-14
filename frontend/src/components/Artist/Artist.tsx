import React, {Component} from "react";
import {
    SingleArtistResponse,
    ArtistObjectFull,
    AlbumObjectSimplified,
    ArtistsAlbumsResponse
} from "spotify-types";
import {API_URL} from "../../utils/constants";
import {Link, NavLink} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Artist.scss"
import "../../cards.scss";
import Album from "../Album/Album";


interface IProps {
    id: string;
}

interface IState {
    artist: ArtistObjectFull;
    albums: AlbumObjectSimplified[];
    singles: AlbumObjectSimplified[];
    appearsOn: AlbumObjectSimplified[];
    compilations: AlbumObjectSimplified[];
    showAlbums: boolean,
    showDiscography: boolean,
    showSingles: boolean,
    showAppearsOn: boolean,
    showCompilations: boolean
}

class Artist extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            artist: {} as ArtistObjectFull,
            albums: [],
            singles: [],
            appearsOn: [],
            compilations: [],
            showAlbums: true,
            showDiscography: true,
            showSingles: true,
            showAppearsOn: true,
            showCompilations: true
        };
        this.hideSection = this.hideSection.bind(this);
    }


    async componentDidMount() {
        // fetch artist
        const artistData: SingleArtistResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}`
        ).then((res) => res.json());
        this.setState({artist: artistData});


        // fetch albums
        const allAlbums: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=album`
        ).then((res) => res.json());
        this.setState((state) => ({...state, albums: allAlbums.items}));
        if(allAlbums === undefined || !(allAlbums.items.length > 0)) {
            this.setState({showAlbums: false});
        }



        // fetch singles
        const allSingles: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=single`
        ).then((res) => res.json());
        this.setState((state) => ({...state, singles: allSingles.items}));
        if(allSingles === undefined || !(allSingles.items.length > 0)) {
            this.setState({showSingles: false});
        }


        // fetch albums where the artist appears on
        const allAppearsOn: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=appears_on`
        ).then((res) => res.json());
        this.setState((state) => ({...state, appearsOn: allAppearsOn.items}));
        if(allAppearsOn === undefined || !(allAppearsOn.items.length > 0)) {
            this.setState({showAppearsOn: false});
        }


        // fetch albums where the artist appears on
        const allCompilations: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=compilation`
        ).then((res) => res.json());
        this.setState((state) => ({...state, compilations: allCompilations.items}));
        if(allCompilations === undefined || !(allCompilations.items.length > 0)) {
            this.setState({showCompilations: false});
        }
    }

    hideSection(value: string){
        const index = Number(value) -1;
        if(index === 0){
            this.setState({showDiscography: true});
            this.setState({showAlbums: false});
            this.setState({showSingles: false});
            this.setState({showAppearsOn: false});
            this.setState({showCompilations: false});
        }
        else if(index === 1){
            this.setState({showAlbums: true});
            this.setState({showDiscography: false});
            this.setState({showSingles: false});
            this.setState({showAppearsOn: false});
            this.setState({showCompilations: false});
        }
        else if(index === 2){
            this.setState({showAlbums: false});
            this.setState({showDiscography: false});
            this.setState({showSingles: true});
            this.setState({showAppearsOn: false});
            this.setState({showCompilations: false});
        }
        else if(index === 3){
            this.setState({showAlbums: false});
            this.setState({showDiscography: false});
            this.setState({showSingles: false});
            this.setState({showAppearsOn: true});
            this.setState({showCompilations: false});
        }
        else if(index === 4){
            this.setState({showAlbums: false});
            this.setState({showDiscography: false});
            this.setState({showSingles: false});
            this.setState({showAppearsOn: false});
            this.setState({showCompilations: true});
        }
        else{
            this.setState({showAlbums: true});
            this.setState({showDiscography: true});
            this.setState({showSingles: true});
            this.setState({showAppearsOn: true});
            this.setState({showCompilations: true});
        }
    }

    render() {

        if(this.state.artist.images === undefined) return <p>loading</p>;

        const artist =<div>
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

        return (
            <div style={{overflow: "hidden auto"}}>
                {/*Filter*/}
                <div className="select">
                    <select className = {"input-select"} onChange={(e) => {this.hideSection(e.target.value)}}>
                        <option value="0">Filter</option>
                        {albums.length > 0 ? (
                            <option value="1">Discography</option>) :(<></>)}
                        {albums.length > 0 ? (
                        <option value="2">Albums</option>):(<></>)}
                        {singles.length > 0 ? (
                        <option value="3">Singles</option>) :(<></>)}
                        {appearsOnAlbum.length > 0 ? (
                        <option value="4">Appears On</option>):(<></>)}
                        {compilations.length > 0 ? (
                        <option value="5">Compilations</option>):(<></>)}

                    </select>
                </div>



                <div className={"artist"}>
                    <h1 className={"titleName"}>Artist</h1>
                {artist}
                </div>
                {/*Discography*/}
                {/* TODO condition ändern*/}
                {this.state.showDiscography && albums.length > 0 ? (
                        <div className={"section"} key={"discography"}>
                            <div className={"header"}>
                                <h2>Discography
                                    <NavLink to={`/discography/${this.props.id}`} className={"viewMoreLink"}>View Entire
                                        Discography</NavLink>
                                </h2>
                            </div>
                            <Album id={this.state.albums[0].id} headerStyle={"none"}/>
                        </div>)
                    : (<></>)}

                {/*Albums*/}
                {this.state.showAlbums && albums.length > 0 ? (
                        <div className={"section"} key={"album"}>
                            <div className={"header"}>
                                <h2>Albums</h2>
                                <NavLink to={`/artist2/${this.props.id}/albums/album`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview"}>
                                <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{albums}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Singles*/}
                {this.state.showSingles && singles.length > 0 ? (
                        <div className={"section"} key={"singles"}>
                            <div className={"header"}>
                                <h2>Singles</h2>
                                <NavLink to={`/artist2/${this.props.id}/albums/single`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview"}>
                                <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{singles}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Appears On*/}
                {this.state.showAppearsOn && appearsOnAlbum.length > 0 ? (
                        <div className={"section"} key="appearsOn">
                            <div className={"header"}>
                                <h2>Appears on</h2>
                                <NavLink to={`/artist2/${this.props.id}/albums/appears_on`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview"}>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{appearsOnAlbum}</ul>
                            </div>
                        </div>)
                    : (<></>)}

                {/*Compilations*/}
                {this.state.showCompilations && compilations.length > 0 ? (
                        <div className={"section"} key="compilations">
                            <div className={"header"}>
                                <h2>Compilations</h2>
                                <NavLink to={`/artist2/${this.props.id}/albums/compilation`} className={"viewMoreLink"}>View
                                    All</NavLink>
                            </div>
                            <div className={"overview"}>
                                <ul className={"overview-items"}
                                    style={{height: '40vh', overflow: 'hidden'}}>{compilations}</ul>
                            </div>
                        </div>)
                    : (<></>)}
            </div>
        );
    }

}

export default Artist;