import React, {useEffect, useState} from 'react';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import {API_URL} from '../../utils/constants';
import "./Player.scss";
import {useDispatch} from 'react-redux';
import {setPlaybackState} from '../../utils/playbackSlice';
import {PlaybackState} from "../../utils/playbackSlice";
import {TrackObjectFull, EpisodeObject} from "spotify-types";
import {Link} from "react-router-dom";
import {getAuthHeader} from '../../helpers/api-helpers';

interface IProps {
    token: string;
    lightTheme: boolean;
}

interface ThemeState {
    color: string;
    altColor: string;
    bgColor: string;
    loaderColor: string;
    sliderTrackColor: string;
    trackArtistColor: string;
    trackNameColor: string;
}

export default function Player(props: IProps) {
    const [track, setTrack] = useState<TrackObjectFull | EpisodeObject | null>();

    const [token, setToken] = useState('');
    const [theme, setTheme] = useState<ThemeState>({
        color: '',
        altColor: '',
        bgColor: '',
        loaderColor: '',
        sliderTrackColor: '',
        trackArtistColor: '',
        trackNameColor: '',
    })

    // fetch the track and use for displaying information about the currently playing track
    async function getPlayingTrackData(trackId: string) {
        const authHeader = getAuthHeader();
        const track = await fetch(`${API_URL}api/spotify/track/${trackId}`, {
            headers: {
                'Authorization': authHeader
            }
        }).then((res) => res.json());
        setTrack(track);
    }

    useEffect(() => {
        if (props.lightTheme) {
            setTheme({
                color: '#1F1F1F',
                altColor: '#1F1F1F',
                bgColor: '#F2F2F2',
                loaderColor: '#1F1F1F',
                sliderTrackColor: '',
                trackArtistColor: '#1F1F1F',
                trackNameColor: '#1F1F1F'
            })
        } else {
            setTheme({
                altColor: '#ccc',
                color: '#E0E0E0',
                bgColor: '#131218',
                loaderColor: '#E0E0E0',
                sliderTrackColor: '',
                trackArtistColor: '#E4E3E2',
                trackNameColor: '#E4E3E2',
            })
        }
    }, [])

    const dispatch = useDispatch();
    const playbackCallback = (state: PlaybackState) => {
        dispatch(setPlaybackState(state));
    }

    useEffect(() => {
        setToken(props.token);
    }, []);

    return (
        <div className={'Player'}>
            {token &&
            <SpotifyWebPlayer
                token={token}
                uris={['spotify:playlist:37i9dQZF1EOedu9gJ5DTVp']}
                name={'Better Spotify 🚀'}
                handlePlayingTrack={getPlayingTrackData}
                styles={{
                    altColor: theme.altColor,
                    color: theme.color,
                    bgColor: theme.bgColor,
                    loaderColor: theme.loaderColor,
                    trackArtistColor: theme.trackArtistColor,
                    trackNameColor: theme.trackNameColor
                }}
                setPlaybackStateCallback={playbackCallback}
            />
            }
            {track !== undefined && track && track.type === "track" ?
                (<div className={"redirect"}>
                    <Link to={`/album/${track.album.id}`} className={"redirect-album"}/>
                    <div className={"test"}>
                        <span className={"artists-section"}>{track.artists.map<React.ReactNode>((a) =>
                            <Link to={`/artist/${a.id}`} className={"artists-name"}
                                  key={a.id}>{a.name}</Link>).reduce((a, b) => [a, ', ', b])}</span></div>
                </div>) : (<></>)}
        </div>
    )
}
