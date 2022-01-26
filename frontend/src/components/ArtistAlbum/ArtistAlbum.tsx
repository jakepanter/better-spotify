import React, { useEffect, useState} from "react";
import {
    AlbumObjectSimplified,
    ArtistsAlbumsResponse
} from "spotify-types";
import {API_URL} from "../../utils/constants";
import {Link, useParams} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "../../cards.scss";

let header: string = "Albums";

export default function ArtistAlbums() {
    let params = useParams() as { id: string, type?: string };
    const id = params.id;
    const type = params.type;

    // for displaying correct header on the page
    if(type === "album"){
        header = "Albums";
    }
    else if(type === "single"){
        header = "Singles";
    }
    else if(type == "appears_on"){
        header = "Appears On"
    }
    else{
        header = "Compilations"
    }

    const [albums, setAlbums] = useState<ArtistsAlbumsResponse>();
    const [albumItems, setAlbumItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextAlbumURL, setNextAlbumURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?market=${localStorage.getItem("country")}&include_groups=${type}`
    );

    // fetch albums
    async function fetchAlbums(url: string) {
        const allAlbums: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setAlbums(allAlbums);
        const arr: AlbumObjectSimplified[] = [...albumItems, ...allAlbums.items];
        setAlbumItems(arr);
    }

    const onScrollAlbums = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (albums && bottom && (albums.next !== null)) {
            const limit = albums.limit;
            const offset = albums.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?market=DE&include_groups=${type}&offset=${offset}&limit=${limit}`;
            setNextAlbumURL(url);
        }
    };

    const allAlbums = albumItems.map((album, index) => {
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


    // when the value of nextAlbumURL changes, call fetchAlbums(nextAlbumURL)
    useEffect(() => {
        fetchAlbums(nextAlbumURL);
    }, [nextAlbumURL]);


    return (
        <div>
            {albumItems.length > 0 ? (
                    <div style={{overflow: "hidden auto"}}>
                        <h2>{header}</h2>
                        <div className={"overview artist-section"} >
                            <ul className={"overview-items"} onScroll={onScrollAlbums}>{allAlbums}</ul>
                        </div>
                    </div>)
                : (<></>)}
        </div>
    );

}
