import React, { Component } from 'react';
import { API_URL } from '../../utils/constants';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import { TrackObjectFull, EpisodeObject} from "spotify-types";
import {Link} from "react-router-dom";

interface IProps {}

interface IState {
    token: string;
    track: TrackObjectFull | EpisodeObject | null;
    trackId: string,
    albumId: string,
    title: string
}


class Player extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.getPlayingTrackData = this.getPlayingTrackData.bind(this);

        this.state = {
            token: '',
            track: {} as TrackObjectFull,
            trackId: "",
            albumId: "",
            title: ""
        };
    }

    async getPlayingTrackData (value: string) {
        this.setState({trackId: value});
        const track = await fetch(`/api/spotify/track/${value}`).then((res)=>res.json());
        this.setState({track: track});
        this.setState({albumId: track.album.id});
        this.setState({title: track.name});
    }

    componentDidMount() {
        this.fetchToken();
    }


    async fetchToken() {
        const token  = await fetch(`${API_URL}api/spotify/access-token`).then(res => res.json());
        if (token) {
            this.setState({
                token: token
            })
        }
    }

    render() {

        return (
            <div className={'Player'}>
            {this.state.token &&
                <SpotifyWebPlayer
                    token={this.state.token}
                    uris={['spotify:playlist:37i9dQZF1EOedu9gJ5DTVp']}
                    name={'Better Spotify 🚀'}
                    handlePlayingTrack={this.getPlayingTrackData}
                />
            }
            <div style={{color: "red"}}>
                <Link to={`/album/${this.state.albumId}`}>GO TO ALBUM</Link>
                <span>{this.state.title}</span>
                {this.state.track && this.state.track.type === "track" ? (<span className={"artists-name"}>{this.state.track.artists.map<React.ReactNode>((a) =>
                        <Link style={{color: "green"}} to={`/artist/${a.id}`} className={"artists-name"} key={a.id}>{a.name}</Link>).reduce((a,b)=>[a,', ',b])}</span>
                ):(<></>)}
            </div>
            </div>
        )
    }
}

export default Player;
