import React, {Component} from "react";
import {
    ArtistObjectFull, ArtistsRelatedArtistsResponse
} from "spotify-types";
import {API_URL} from '../../utils/constants';
import {Link} from "react-router-dom";
import "../../cards.scss";


interface IProps {
    id: string;
}

interface IState {
    relatedArtistsList: ArtistObjectFull[];
}

class RelatedArtists extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            relatedArtistsList: [],
        };
    }

    async componentDidMount() {
        // Fetch playlists
        const relatedArtists: ArtistsRelatedArtistsResponse = await fetch(
            `${API_URL}api/spotify/artists/${this.props.id}/related-artists`
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, relatedArtistsList: relatedArtists.artists}));
    }

    render() {
        if (this.state.relatedArtistsList.length === 0) return <p>loading...</p>;
        const relatedArtists = this.state.relatedArtistsList.map((artist) => {
            return (
                <li className="column" key={artist.id}>
                    <Link to={`/artist/${artist.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${artist.images[0].url})`
                        }}>
                        </div>
                        <span className="title">{artist.name}</span>
                    </Link>
                </li>
            );
        });

        return (
            <div style={{overflow: 'hidden auto'}}>
                <h2>More Like &quot; &quot;</h2>
                <div className={"overview"}>
                    <ul className={"overview-items"}>{relatedArtists}</ul>
                </div>
            </div>

        );
    }
}

export default RelatedArtists;