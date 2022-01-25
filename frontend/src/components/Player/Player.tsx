import React, {Component} from 'react';
import {API_URL} from '../../utils/constants';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import {TrackObjectFull, EpisodeObject} from "spotify-types";
import {Link} from "react-router-dom";

interface IProps {
}

interface IState {
    token: string;
    track: TrackObjectFull | EpisodeObject | null;
}


class Player extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.getPlayingTrackData = this.getPlayingTrackData.bind(this);

        this.state = {
            token: '',
            track: {} as TrackObjectFull
        };
    }

    // fetch the track and use for displaying information about the currently playing track
    async getPlayingTrackData(trackId: string) {
        const track = await fetch(`/api/spotify/track/${trackId}`).then((res) => res.json());
        this.setState({track: track});
    }

    componentDidMount() {
        this.fetchToken();
    }


    async fetchToken() {
        const token = await fetch(`${API_URL}api/spotify/access-token`).then(res => res.json());
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
                {this.state.track && this.state.track.type === "track" ?
                    (<div className={"redirect"}>
                        <Link to={`/album/${this.state.track.album.id}`} className={"redirect-album"}/>
                        <div className={"test"}>
                        <span className={"artists-section"}>{this.state.track.artists.map<React.ReactNode>((a) =>
                            <Link to={`/artist/${a.id}`} className={"artists-name"}
                                  key={a.id}>{a.name}</Link>).reduce((a, b) => [a, ', ', b])}</span></div>
                    </div>) : (<></>)}
            </div>
        )
    }
}

export default Player;
