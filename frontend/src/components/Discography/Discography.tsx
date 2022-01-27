import React, {useEffect, useRef, useState} from "react";
import {ArtistsAlbumsResponse, AlbumObjectSimplified} from "spotify-types";
import { API_URL } from "../../utils/constants";
import Album from "../Album/Album";
import { getAuthHeader } from '../../helpers/api-helpers';


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
    //TODO isMounted
    const isMounted = useRef(false)

    async function fetchAlbums(url: string) {
        if( isMounted.current) {
            const authHeader = getAuthHeader();
            const allAlbums: ArtistsAlbumsResponse = await fetch(url, {
                headers: {
                    'Authorization': authHeader
                }
            }).then((res) => res.json());
            isMounted.current && setAlbums(allAlbums);
            const arr: AlbumObjectSimplified[] = [...albumItems, ...allAlbums.items];
            isMounted.current && setAlbumItems(arr);
        }
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
            isMounted.current && setNextAlbumURL(url);
        }
    };

    // when the value of nextAlbumURL changes, call fetchAlbums(nextAlbumURL)
    useEffect(() => {
        isMounted.current = true;
        isMounted.current && fetchAlbums(nextAlbumURL)
        return () => { isMounted.current = false }
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
