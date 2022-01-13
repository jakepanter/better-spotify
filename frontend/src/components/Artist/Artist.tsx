import React, {Component} from "react";
import {
    SingleArtistResponse,
    //ArtistObjectFull,
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
    albums: AlbumObjectSimplified[];
    singles: AlbumObjectSimplified[];
    appearsOn: AlbumObjectSimplified[];
    compilations: AlbumObjectSimplified[];
}

class Artist extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            albums: [],
            singles: [],
            appearsOn: [],
            compilations: []
        };
    }


    async componentDidMount() {
        // fetch artist
        const artistData: SingleArtistResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}`
        ).then((res) => res.json());
        const artist = artistData;
        console.log(artistData);
        console.log(artist);

        // fetch albums
        const allAlbums: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=album`
        ).then((res) => res.json());
        this.setState((state) => ({...state, albums: allAlbums.items}));


        // fetch singles
        const allSingles: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=single`
        ).then((res) => res.json());
        this.setState((state) => ({...state, singles: allSingles.items}));


        // fetch albums where the artist appears on
        const allAppearsOn: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=appears_on`
        ).then((res) => res.json());
        this.setState((state) => ({...state, appearsOn: allAppearsOn.items}));


        // fetch albums where the artist appears on
        const allCompilations: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=5&market=DE&include_groups=compilation`
        ).then((res) => res.json());
        this.setState((state) => ({...state, compilations: allCompilations.items}));
    }

    render() {
        const albums = this.state.albums.map((album) => {
            return (
                <li className={"column"} key={album.id}>
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

        const singles = this.state.singles.map((single) => {
            return (
                <li className={"column"} key={single.id}>
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
        const appearsOnAlbum = this.state.appearsOn.map((album) => {
            return (
                <li className={"column"} key={album.id}>
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
        const compilations = this.state.compilations.map((compilation) => {
            return (
                <li className={"column"} key={compilation.id}>
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
                {albums.length > 0 ? (
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

                {albums.length > 0 ? (
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

                {singles.length > 0 ? (
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

                {appearsOnAlbum.length > 0 ? (
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

                {compilations.length > 0 ? (
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