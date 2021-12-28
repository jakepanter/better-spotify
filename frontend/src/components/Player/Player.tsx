import React, { Component } from 'react';
import { API_URL } from '../../utils/constants';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";

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
                    uris={['spotify:track:2aibwv5hGXSgw7Yru8IYTO']}
                    name={'Better Spotify 🚀'}
                />
            }
            </div>
        )
    }
}

export default Player;
