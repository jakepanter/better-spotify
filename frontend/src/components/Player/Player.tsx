import React, { Component } from 'react';
import { API_URL } from '../../utils/constants';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import {CurrentPlaybackResponse} from "spotify-types";

interface IProps {}

interface IState {
    token: string;
}


class Player extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            token: '',
        };
    }

    componentDidMount() {
        this.fetchToken();
        this.currentPlayingSong();
    }

    async currentPlayingSong(){
        const currentPlayingSong:CurrentPlaybackResponse = await fetch(`${API_URL}api/spotify/player/currently-playing`).then(res => res.json());
        console.log("This is current: ");
        console.log(currentPlayingSong.item);
    }

    async fetchToken() {
        const token  = await fetch(`${API_URL}api/spotify/access-token`).then(res => res.json());
        if (token) {
            this.setState({
                token: token
            })
        }
        console.log("This is token: ");
        console.log(this.state.token);
    }

    render() {
        return (
            <div className={'Player'}>
            {this.state.token &&
                <SpotifyWebPlayer
                    token={this.state.token}
                    uris={['spotify:playlist:37i9dQZF1EOedu9gJ5DTVp']}
                    name={'Better Spotify 🚀'}
                />
            }
            </div>
        )
    }
}

export default Player;
