import React, {useEffect, useState} from 'react';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import { useDispatch } from 'react-redux';
import { setPlaybackState } from '../../utils/playbackSlice';
import {PlaybackState} from "../../utils/playbackSlice";

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

    const [token, setToken] = useState('');
    const [theme, setTheme] = useState<ThemeState>({
        color: '',
        altColor: '',
        bgColor: '',
        loaderColor: '',
        sliderTrackColor: '',
        trackArtistColor: '',
        trackNameColor: ''
    })

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
        </div>
    )
}
