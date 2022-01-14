import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./Podcasts.scss";
import {
    UsersSavedShowsResponse,
    MultipleShowsResponse,
    ShowObjectSimplified
} from "spotify-types";
import "../../cards.scss";
import {API_URL} from '../../utils/constants';

interface IProps {
}

interface IState {
    results: ShowObjectSimplified[];
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
        var shows: ShowObjectSimplified[] = []
        const data: UsersSavedShowsResponse = await fetch(
            `${API_URL}api/spotify/me/shows`
        ).then((res) => res.json());
        if(data.items.length > 0) {
            data.items.map(savedShow => {
                shows.push(savedShow.show);
            });
        }
        else if(data.items.length == 0){
            console.log("hallo");
            const fallbackShows = "4QwUbrMJZ27DpjuYmN4Tun%2C1OLcQdw2PFDPG1jo3s0wbp%2C7BTOsF2boKmlYr76BelijW%2C6wPqbSlsvoi3Rgjjc2Sn4R%2C5m4Ll1qIBX29cTd0T9WwKp"
            const fallback: MultipleShowsResponse = await fetch(
                `${API_URL}api/spotify/shows?showIds=${fallbackShows}`
            ).then((res) => res.json());
            fallback.shows.map(savedShow => {
                shows.push(savedShow);
            });
        }
        this.setState((state) => ({...state, results: shows}));
    }

    render() {
        if (this.state.results.length === 0) return <p>loading...</p>;
        const shows = this.state.results.map(savedShow => {
            return (
                <li className={"column"} key={savedShow.id}>
                    <Link to={`/show/${savedShow.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${savedShow.images[0].url})`
                        }}>
                        </div>
                        <span className={"title"}>{savedShow.name}</span>
                        <span className={"artists-name"}>by {savedShow.publisher}</span>
                    </Link>
                </li>
            );
        });
        if(this.state.results)

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
