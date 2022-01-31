import React, { useEffect, useState } from "react";
import {
    ListOfNewReleasesResponse,
    AlbumObjectSimplified
} from "spotify-types";
import { API_URL } from '../../utils/constants';
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import {Link, useHistory} from "react-router-dom";
import "./Releases.scss";
import {formatTimeDiff} from "../../utils/functions";
import { getAuthHeader } from '../../helpers/api-helpers';

const limit = 24;

export default function Releases() {
    // The list of releases (albums)
    const [releases, setReleases] = useState<ListOfNewReleasesResponse>();
    // The list of releases (albums)
    const [albums, setAlbums] = useState<AlbumObjectSimplified[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const history = useHistory();

    // Fetch more album tracks if necessary
    useEffect(() => {
        fetchTrackData(offset);
    }, [offset]);

    async function fetchTrackData(offset: number) {
        const authHeader = getAuthHeader();
        //get users country
        const country = localStorage.getItem("country");
        const data: ListOfNewReleasesResponse = await fetch(`${API_URL}api/spotify/browse/new-releases?limit=${limit}&country=${country}&offset=${offset}`, {
            headers: {
                'Authorization': authHeader
            }
        }).then((res) => res.json());
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

    const goToArtist = (e: any, artistId: string) => {
        e.preventDefault();
        history.push(`/artist/${artistId}`)
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
                <span className={"CardArtist"}>{album.artists.map<React.ReactNode>((a) =>
                    <span onClick={e => goToArtist(e, a.id)} className={"artists-name"} key={a.id}>{a.name}</span>).reduce((a,b)=>[a,', ',b])}</span>
                <span className={"CardAddedAt"}>{formatTimeDiff(new Date(album.release_date).getTime(), Date.now())}</span>
            </Link>
        );
    });

    return (
        <div className={'Releases'}>
            <div className={'Content'} onScroll={onScroll}
            >
                <div className={'CoverList'}>{releasedAlbums}</div>
            </div>
        </div> );
}
