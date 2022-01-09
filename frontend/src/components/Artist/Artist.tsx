import React, {Component} from "react";
import {
    AlbumObjectSimplified,
    ArtistsAlbumsResponse
} from "spotify-types";
import {API_URL} from "../../utils/constants";
import {Link} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "../../cards.scss";
/*import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";*/

// The fetching limit, can be adjusted by changing this value
const limit = 50;

//const include_groups = "";

interface IProps {
    id: string;
}


interface IState {
    albums: AlbumObjectSimplified[];
    albumSingles: AlbumObjectSimplified[];
    appearsOnAlbum: AlbumObjectSimplified[];
    compilations: AlbumObjectSimplified[];
    ids: string[];
}

class Artist extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            albums: [],
            albumSingles: [],
            appearsOnAlbum:[],
            compilations: [],
            ids:[]
        };
    }

    async componentDidMount() {
        // Fetch albums, these include albums, singles and appears_on
        const allAlbums: ArtistsAlbumsResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=DE`
        ).then((res) => res.json());

        console.log(allAlbums);

        //filter all albums
        const onlyAlbums: AlbumObjectSimplified[] = allAlbums.items.filter((album) => {
            if (album.album_group === undefined) return;
            return album.album_group.includes("album");
        });
        // Save to state
        this.setState((state) => ({...state, albums: onlyAlbums}));

        //filter all singles
        const singles: AlbumObjectSimplified[] = allAlbums.items.filter((album) => {
            if (album.album_group === undefined) return;
            return album.album_group.includes("single");
        });
        //save to state
        this.setState((state) => ({...state, albumSingles: singles}));

        //filter all albums where the artist appears on
        const appearsOn: AlbumObjectSimplified[] = allAlbums.items.filter((album) => {
            if (album.album_group === undefined) return;
            return album.album_group.includes("appears_on");
        });
        //save to state
        this.setState((state) => ({...state, appearsOnAlbum: appearsOn}));

        //filter all compilations where the artist appears on
        const compilations: AlbumObjectSimplified[] = allAlbums.items.filter((album) => {
            if (album.album_group === undefined) return;
            return album.album_group.includes("compilation");
        });
        //save to state
        this.setState((state) => ({...state, compilationsAlbum: compilations}));

        //filter all ids
        allAlbums.items.filter((album) => {
            this.setState({ ids: [...this.state.ids, album.id] })
        });
        //console.log(this.state.ids);
    }

    render() {
        //if (this.state.albums.length === 0) return <p>loading...</p>;
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
                        <span className={"artists-name"}>{album.artists[0].name}</span>
                    </Link>
                </li>
            );
        });

        const singles = this.state.albumSingles.map((single) => {
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
        const appearsOnAlbum = this.state.appearsOnAlbum.map((album) => {
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
            <div>
                <div>
                    <h2>Discography</h2>
                    <Link to={`/discography/${this.props.id}`}>View All</Link>
                </div>
                {albums.length > 0 ? (
                    <div style={{overflow: "hidden auto"}}>
                        <h2>Albums</h2>
                        <div className={"overview"}>
                            <ul className={"overview-items"}>{albums}</ul>
                        </div>
                    </div>)
                        : (<></>)}
                {singles.length > 0 ? (
                <div style={{overflow: "hidden auto"}}>
                    <h2>Singles</h2>
                    <div className={"overview"}>
                        <ul className={"overview-items"}>{singles}</ul>
                    </div>
                </div>
                    )
                    : (<></>)}
                {appearsOnAlbum.length > 0 ? (
                        <div style={{overflow: "hidden auto"}}>
                            <h2>Appears on</h2>
                            <div className={"overview"}>
                                <ul className={"overview-items"}>{appearsOnAlbum}</ul>
                            </div>
                        </div>
                    )
                    : (<></>)}
                {compilations.length > 0 ? (
                        <div style={{overflow: "hidden auto"}}>
                            <h2>Compilations</h2>
                            <div className={"overview"}>
                                <ul className={"overview-items"}>{compilations}</ul>
                            </div>
                        </div>
                    )
                    : (<></>)}
            </div>
        );
    }
}

export default Artist;