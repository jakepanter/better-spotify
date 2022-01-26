import React, { useEffect, useState } from "react";
import {ArtistsAlbumsResponse, AlbumObjectSimplified} from "spotify-types";
import { API_URL } from "../../utils/constants";
import Album from "../Album/Album";


// The fetching limit, can be adjusted by changing this value
const limit = 2;

interface IProps {
    id: string;
}

export default function Discography (props: IProps) {

    const { id } = props;
    const [albums, setAlbums] = useState<ArtistsAlbumsResponse>();
    const [albumItems, setAlbumItems] = useState<AlbumObjectSimplified[]>([]);
    const [nextAlbumURL, setNextAlbumURL] = useState<string>(
        `${API_URL}api/spotify/artist/${id}/albums?country=${localStorage.getItem("country")}&limit=${limit}&include_groups=album,single`
    );

    async function fetchAlbums(url: string) {
        const allAlbums: ArtistsAlbumsResponse = await fetch(url).then((res) => res.json());
        setAlbums(allAlbums);
        const arr: AlbumObjectSimplified[] = [...albumItems, ...allAlbums.items];
        setAlbumItems(arr);
    }

    if (!albums && !albumItems) return <p>loading...</p>;

    const allAlbums = albumItems.map((album) => {
        return(
            <Album id={album.id} headerStyle={"full"} key={album.id}/>
        )
    });

    const onScroll = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && albums && (albums.next !== null)) {
            const limit = albums.limit;
            const offset = albums.offset + limit;
            const url = `${API_URL}api/spotify/artist/${id}/albums?country="DE"&offset=${offset}&limit=${limit}&market=DE&include_groups=album,single`;
            setNextAlbumURL(url);
        }
    };

    // when the value of nextAlbumURL changes, call fetchAlbums(nextAlbumURL)
    useEffect(() => {
        fetchAlbums(nextAlbumURL)
    }, [nextAlbumURL]);



    return(
        <div style={{overflow: "hidden auto"}}>
        <div>
        <div className={"list-items"} style={{overflow: "scroll", height: "75vh"}} onScroll={onScroll}>
            {allAlbums}
        </div>
        </div>
        </div>
    )
}
