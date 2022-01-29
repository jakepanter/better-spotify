import React, { Component } from 'react';
import { API_URL } from '../../utils/constants';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import {TrackObjectFull, EpisodeObject} from "spotify-types";
import {Link} from "react-router-dom";

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
    track: TrackObjectFull | EpisodeObject | null;
}

class Player extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.getPlayingTrackData = this.getPlayingTrackData.bind(this);

        this.state = {
            token: '',
            color: '',
            altColor: '',
            bgColor: '',
            loaderColor: '',
            sliderTrackColor: '',
            trackArtistColor: '',
            trackNameColor: ''
            track: {} as TrackObjectFull
        };
    }

    // fetch the track and use for displaying information about the currently playing track
    async getPlayingTrackData(trackId: string) {
        const track = await fetch(`/api/spotify/track/${trackId}`).then((res) => res.json());
        this.setState({track: track});
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
                    handlePlayingTrack={this.getPlayingTrackData}
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
