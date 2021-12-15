import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./Podcasts.scss";
import {
    UsersSavedShowsResponse,
    SavedShowObject
} from "spotify-types";
import "../../cards.scss";
import {API_URL} from '../../utils/constants';

interface IProps {
}

interface IState {
    results: SavedShowObject[];
}

class Podcasts extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            results: [],
        };
    }

    async componentDidMount() {
        // Fetch playlists
        const data: UsersSavedShowsResponse = await fetch(
            `${API_URL}api/spotify/me/shows`
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, results: data.items}));
    }

    render() {
        if (this.state.results.length === 0) return <p>loading...</p>;
        const shows = this.state.results.map(savedShow => {
            return (
                <li className={"column"} key={savedShow.show.id}>
                    <Link to={`/playlist/${savedShow.show.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${savedShow.show.images[0].url})`
                        }}>
                        </div>
                        <span className={"title"}>{savedShow.show.name}</span>
                        <span className={"artists-name"}>by {savedShow.show.publisher}</span>
                    </Link>
                </li>
            );
        });

        return (
            <div style={{overflow: 'hidden auto'}}>
                <h2>My Podcasts</h2>
                <div className={"overview"}>
                    <ul className={"overview-items"}>{shows}</ul>
                </div>
            </div>
        );
    }
}

export default Podcasts;
