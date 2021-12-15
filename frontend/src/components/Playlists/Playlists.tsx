import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "../../cards.scss";
import {API_URL} from '../../utils/constants';

interface IProps {}

interface IState {
  results: PlaylistObjectSimplified[];
}

class Playlists extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            results: [],
        };
    }

    async componentDidMount() {
        // Fetch playlists
        const data: ListOfUsersPlaylistsResponse = await fetch(
            `${API_URL}api/spotify/playlists`
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, results: data.items}));
    }

    render() {
        if (this.state.results.length === 0) return <p>loading...</p>;
        const playlists = this.state.results.map((playlist) => {
            return (
                <li className={"column"} key={playlist.id}>
                    <Link to={`/playlist/${playlist.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${playlist.images[0].url})`
                        }}>
                        </div>
                        <span className={"title"}>{playlist.name}</span>
                        <span className={"artists-name"}>by {playlist.owner.display_name}</span>
                    </Link>
                </li>
            );
        });

        return (
            <div style={{overflow: 'hidden auto'}}>
                <h2>My Playlists</h2>
                <div className={"overview"}>
                    <ul className={"overview-items"}>{playlists}</ul>
                </div>
            </div>
        );
    }
}

export default Playlists;
