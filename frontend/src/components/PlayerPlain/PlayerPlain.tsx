import React, { Component } from 'react';
import { API_URL } from '../../utils/constants';
import WebPlayback from './WebPlayback'

interface IProps {}

interface IState {
    token: string;
}

class PlayerPlain extends Component<IProps, IState> {
    // @ts-ignore
    private player: Window.Spotify.Player;

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
        console.log(`token: ${token}`);
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
                <WebPlayback token={this.state.token} />
            }
            </div>
        )
    }
}

export default PlayerPlain;
