import React, { useEffect, useState } from "react";
import {
    ListOfNewReleasesResponse,
    AlbumObjectSimplified
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import {Link} from "react-router-dom";
import "./Releases.scss";

const limit = 24;
let country: string;

export default function Releases() {
    // The list of releases (albums)
    const [releases, setReleases] = useState<ListOfNewReleasesResponse>();
    // The list of releases (albums)
    const [albums, setAlbums] = useState<AlbumObjectSimplified[]>([]);
    const [offset, setOffset] = useState<number>(0);

    // Fetch more album tracks if necessary
    useEffect(() => {
        fetchTrackData(offset);
    }, [offset]);

    async function fetchTrackData(offset: number) {
        //get users country
        const me = await fetch(
            `${API_URL}api/spotify/me`
        ).then((res) => res.json());
        country = me.country;

        const data: ListOfNewReleasesResponse = await fetch(`${API_URL}api/spotify/browse/new-releases?limit=${limit}&country=${country}&offset=${offset}`).then((res) => res.json());
        setReleases(data);
        // Save new tracks
        const arr: AlbumObjectSimplified[] = [...albums, ...data.albums.items];
        setAlbums(arr);
    }



    //fetch next albums when you reach the bottom of the current list
    const onScroll = (e: any) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && releases && offset !== releases.albums.total) {
            const limit = releases.albums.limit;
            const offset = Number(releases.albums.offset) + Number(limit);
            setOffset(offset);
        }
    };

    if (!releases || !albums) return <p>loading...</p>;
    const releasedAlbums = albums.map((album)=>{
        return(
            <Link to={`/album/${album.id}`}
                  className={'Card'}
                  key={album.id}
            >
                {album.images.length > 0 ? (
                    <div
                        className={"CardCover"}
                        style={{ backgroundImage: `url(${album.images[0].url}` }} key={album.id}
                    />
                ) : (
                    <CoverPlaceholder />
                )}
                <span className={"CardTitle"}>{album.name}</span>
                <span className={"CardArtist"}>{album.artists.map((a) => a.name).join(", ")}</span>
            </Link>
        );
    });

    return (
        <div className={'Releases'}>
            <h2 className={'Header'}>Albums</h2>
            <div className={'Content'} onScroll={onScroll}
            >
                <div className={'CoverList'}>{releasedAlbums}</div>
            </div>
        </div> );
}
