import React, { Component } from 'react';
import './PlayerOld.scss';
import SpotifyWebPlayer from "react-spotify-web-playback";
import { API_URL } from '../../utils/constants';


interface IProps {}

interface IState {
    token: string;
}

class PlayerOld extends Component<IProps, IState> {

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
                    <SpotifyWebPlayer
                        name={'Better Spotify'}
                        token={this.state.token}
                        uris={['spotify:artist:53XhwfbYqKCa1cC15pYq2q']}
                        styles={{
                            activeColor: '#000',
                            bgColor: '#fff',
                            color: '#000',
                            loaderColor: '#fff',
                            sliderColor: '#333',
                            trackArtistColor: '#333',
                            trackNameColor: '#333',
                        }}
                        syncExternalDevice={true}
                    />
            }
            </div>
        )
    }
}

export default PlayerOld;
