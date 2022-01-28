import React, {Component} from "react";
import {
    ArtistObjectFull, ArtistsRelatedArtistsResponse, SingleArtistResponse
} from "spotify-types";
import {API_URL} from '../../utils/constants';
import {Link} from "react-router-dom";
import "../../cards.scss";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { getAuthHeader } from '../../helpers/api-helpers';


interface IProps {
    id: string;
}

interface IState {
    artistName: string;
    relatedArtistsList: ArtistObjectFull[];
}

class RelatedArtists extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            relatedArtistsList: [],
            artistName: "",
        };
    }

    async componentDidMount() {
        // Fetch playlists
        const authHeader = getAuthHeader();
        const relatedArtists: ArtistsRelatedArtistsResponse = await fetch(
            `${API_URL}api/spotify/artists/${this.props.id}/related-artists`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, relatedArtistsList: relatedArtists.artists}));

        const artist: SingleArtistResponse = await fetch(
            `${API_URL}api/spotify/artist/${this.props.id}`, {
                headers: {
                    'Authorization': authHeader
                }
            }
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, artistName: artist.name}));

    }

    render() {
        if (this.state.relatedArtistsList.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.relatedArtistsList.map((artist) => {
            return (
                <li className="column" key={artist.id}>
                    <Link to={`/artist/${artist.id}`}>
                        {artist.images !==undefined ? (
                            <div className={"cover"} style={{
                                backgroundImage: `url(${artist.images[0].url})`
                            }}>
                            </div>
                        ) :(
                            <CoverPlaceholder/>
                        )}
                        <span className="title">{artist.name}</span>
                    </Link>
                </li>
            );
        });

        return (
            <div style={{overflow: 'hidden auto'}}>
                <h2>More Like &quot;{this.state.artistName}&quot;</h2>
                <div className={"overview"}>
                    <ul className={"overview-items"}>{relatedArtists}</ul>
                </div>
            </div>
        );
    }
}

export default RelatedArtists;