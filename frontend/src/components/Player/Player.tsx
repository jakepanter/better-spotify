import React, { Component } from 'react';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";

interface IProps {
    token: string;
    lightTheme: boolean;
}

interface IState {
    token: string;
    color: string;
    altColor: string;
    bgColor: string;
    loaderColor: string;
    sliderTrackColor: string;
    trackArtistColor: string;
    trackNameColor: string;
}

class Player extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            token: '',
            color: '',
            altColor: '',
            bgColor: '',
            loaderColor: '',
            sliderTrackColor: '',
            trackArtistColor: '',
            trackNameColor: ''
        };
    }

    componentDidMount() {
        const token = this.props.token;
        this.setState({
            token: token
        });

        if (this.props.lightTheme) {
            this.setState({
                altColor: '#1F1F1F',
                color: '#1F1F1F',
                bgColor: '#F2F2F2',
                loaderColor: '#1F1F1F',
                trackArtistColor: '#1F1F1F',
                trackNameColor: '#1F1F1F'
            })
        } else {
            this.setState({
                altColor: '#ccc',
                color: '#E0E0E0',
                bgColor: '#131218',
                loaderColor: '#E0E0E0',
                trackArtistColor: '#E4E3E2',
                trackNameColor: '#E4E3E2',
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
                    styles={{
                        altColor: this.state.altColor,
                        color: this.state.color,
                        bgColor: this.state.bgColor,
                        loaderColor: this.state.loaderColor,
                        trackArtistColor: this.state.trackArtistColor,
                        trackNameColor: this.state.trackNameColor
                    }}
                />
            }
            </div>
        )
    }
}

export default Player;
