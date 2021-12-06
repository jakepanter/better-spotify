import React, {Component} from "react";
import {Link} from "react-router-dom";
import {
    ListOfUsersPlaylistsResponse,
    PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import {API_URL} from '../../utils/constants';

interface IProps {
}

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
                        <div className={"Cover"} style={{
                            backgroundImage: `url(${playlist.images[0].url})`,
                            //backgroundSize: "auto 100%",
                        }}>
                        </div>
                        <span className={"Title"}>{playlist.name}</span>
                        <span className={"Owner"}>by {playlist.owner.display_name}</span>
                    </Link>
                </li>
            );
        });

        return (
            <>
                <h2>My Playlists</h2>
                <div className={"Playlists"}>
                    <ul className={"Playlist-items"}>{playlists}</ul>
                </div>
            </>
        );
    }
}

export default Playlists;
