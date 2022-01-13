import React, { useEffect, useState} from "react";
import {
    AlbumObjectSimplified,
    ArtistsAlbumsResponse
} from "spotify-types";
import {API_URL} from "../../utils/constants";
import {Link} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "../../cards.scss";
import Album from "../Album/Album";


interface IProps {
    id: string;
}


export default function Artist(props: IProps) {
    const {id} = props;
    // for albums
    const [albums, setAlbums] = useState<ArtistsAlbumsResponse>();
    const [albumItems, setAlbumItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextAlbumURL, setNextAlbumURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=album`
    );
    // for singles
    const [singles, setSingles] = useState<ArtistsAlbumsResponse>();
    const [singleItems, setSingleItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextSingleURL, setNextSingleURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=single`
    );
    // for albums where the artist appears on
    const [appears_on, setAppearsOn] = useState<ArtistsAlbumsResponse>();
    const [appearsOnItems, setAppearsOnItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextAppearsOnURL, setNextAppearsOnURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=appears_on`
    );
    // for compilations
    const [compilations, setCompilations] = useState<ArtistsAlbumsResponse>();
    const [compilationItems, setCompilationItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextCompilationURL, setNextCompilationURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=compilation`
    );


    // fetch albums
    async function fetchAlbums(url: string) {
        const allAlbums: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setAlbums(allAlbums);
        const arr: AlbumObjectSimplified[] = [...albumItems, ...allAlbums.items];
        setAlbumItems(arr);
    }

    //fetch singles
    async function fetchSingles(url: string) {
        const allSingles: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setSingles(allSingles);
        const arr: AlbumObjectSimplified[] = [...singleItems, ...allSingles.items];
        //console.log(arr)
        setSingleItems(arr);
    }

    // fetch albums where the artist appears on
    async function fetchAppearsOn(url: string) {
        const allAppearsOn: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setAppearsOn(allAppearsOn);
        const arr: AlbumObjectSimplified[] = [...appearsOnItems, ...allAppearsOn.items];
        //console.log(arr)
        setAppearsOnItems(arr);
    }

    // fetch albums where the artist appears on
    async function fetchCompilations(url: string) {
        const allCompilations: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setCompilations(allCompilations);
        const arr: AlbumObjectSimplified[] = [...compilationItems, ...allCompilations.items];
        //console.log(arr)
        setCompilationItems(arr);
    }

    const onScrollAlbums = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && albums && (albums.next !== null)) {
            const limit = albums.limit;
            const offset = albums.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=album&offset=${offset}&limit=${limit}`;
            setNextAlbumURL(url);
        }
    };

    //TODO
    // check if all onScrolls are implemented corrected
    // especially check if the checked conditions makes sense
    const onScrollSingles = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && singles && (singles.next !== null)) {
            const limit = singles.limit;
            const offset = singles.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=single&offset=${offset}&limit=${limit}`;
            setNextSingleURL(url);
        }
    };

    const onScrollAppearsOn = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && appears_on && (appears_on.next !== null)) {
            const limit = appears_on.limit;
            const offset = appears_on.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=appears_on&offset=${offset}&limit=${limit}`;
            setNextAppearsOnURL(url);
        }
    };
    const onScrollCompilations = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && compilations && (compilations.next !== null)) {
            const limit = compilations.limit;
            const offset = compilations.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=compilations&offset=${offset}&limit=${limit}`;
            setNextCompilationURL(url);
        }
    };
        const allAlbums = albumItems.map((album) => {
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

        const allSingles = singleItems.map((single) => {
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

        const allAppearsOn = appearsOnItems.map((album) => {
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

        const allCompilations = compilationItems.map((compilation) => {
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

    useEffect(() => {
        fetchAlbums(nextAlbumURL);
    }, [nextAlbumURL]);

    useEffect(() => {
        fetchSingles(nextSingleURL);
    }, [nextSingleURL]);

    useEffect(() => {
        fetchAppearsOn(nextAppearsOnURL);
    }, [nextAppearsOnURL]);

    useEffect(() => {
        fetchCompilations(nextCompilationURL);
    }, [nextCompilationURL]);

        return (
            <div>
                <div>
                    <h2>Discography</h2>
                    <Link to={`/discography/${id}`}>View Entire Discography</Link>
                    {albumItems.length > 0 ? (
                    <Album id={albumItems[0].id} headerStyle={"none"}/>
                        ) : (<></>)}
                </div>

                {albumItems.length > 0 ? (
                    <div style={{overflow: "hidden auto"}}>
                        <h2>Albums</h2>
                        <div className={"overview"} >
                            <ul className={"overview-items"} onScroll={onScrollAlbums}>{allAlbums}</ul>
                        </div>
                    </div>)
                        : (<></>)}

               {allSingles.length > 0 ? (
                <div style={{overflow: "hidden auto"}}>
                    <h2>Singles</h2>
                    <div className={"overview"}>
                        <ul className={"overview-items"} onScroll={onScrollSingles}>{allSingles}</ul>
                    </div>
                </div>
                    )
                    : (<></>)}

                {allAppearsOn.length > 0 ? (
                        <div style={{overflow: "hidden auto"}}>
                            <h2>Appears on</h2>
                            <div className={"overview"}>
                                <ul className={"overview-items"} onScroll={onScrollAppearsOn}>{allAppearsOn}</ul>
                            </div>
                        </div>
                    )
                    : (<></>)}

                {allCompilations.length > 0 ? (
                        <div style={{overflow: "hidden auto"}}>
                            <h2>Compilations</h2>
                            <div className={"overview"}>
                                <ul className={"overview-items"} onScroll={onScrollCompilations}>{allCompilations}</ul>
                            </div>
                        </div>
                    )
                    : (<></>)}
            </div>
        );

}
