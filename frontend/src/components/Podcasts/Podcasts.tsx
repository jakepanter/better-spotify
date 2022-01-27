import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./Podcasts.scss";
import "../../cards.scss";
import {
    UsersSavedShowsResponse,
    MultipleShowsResponse,
    ShowObjectSimplified
} from "spotify-types";
import "../../cards.scss";
import {API_URL} from '../../utils/constants';
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { getAuthHeader } from '../../helpers/api-helpers';

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
        const shows: ShowObjectSimplified[] = []
        
        // fetching saved Shows of Users
        const authHeader = getAuthHeader();
        const data: UsersSavedShowsResponse = await fetch(
            `${API_URL}api/spotify/me/shows`, {
            headers: {
                'Authorization': authHeader
            }
        }).then((res) => res.json());
        if(data.items.length > 0) {
            data.items.map(savedShow => {
                shows.push(savedShow.show);
            });
        }

        // Fallback if User doesn't have any shows saved
        else if(data.items.length == 0){
            const fallbackShows = "4QwUbrMJZ27DpjuYmN4Tun%2C1OLcQdw2PFDPG1jo3s0wbp%2C7BTOsF2boKmlYr76BelijW%2C6wPqbSlsvoi3Rgjjc2Sn4R%2C5m4Ll1qIBX29cTd0T9WwKp"
            const fallback: MultipleShowsResponse = await fetch(
                `${API_URL}api/spotify/shows?showIds=${fallbackShows}`, {
                    headers: {
                        'Authorization': authHeader
                    }
                }).then((res) => res.json());
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
            <Link 
                to={`/show/${savedShow.id}`}
                className={"Card"}
                key={savedShow.id}
            >   
                {savedShow.images.length > 0 ? (
                <div
                    className={"CardCover"}
                    style={{ backgroundImage: `url(${savedShow.images[0].url}` }}
                />
                ) : (
                <CoverPlaceholder/>
                )}
                <span className={"CardTitle"}>{savedShow.name}</span>
                <span className={"CardArtist"}>by {savedShow.publisher}</span>
            </Link>
            );
        });
        if(this.state.results)

        return (
            <div className={"Shows"}>
                <h2 className={"Header"}>Podcasts</h2>
                <div className={"Content"}>
                    <div className={"CoverList"}>{shows}</div>
                </div>
            </div>
        );
    }
}

export default Podcasts;
