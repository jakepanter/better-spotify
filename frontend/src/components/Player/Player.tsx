import React, {useEffect, useState} from 'react';
import SpotifyWebPlayer from "./SpotifyWebPlayer";
import "./Player.scss";
import { useDispatch } from 'react-redux';
import { setPlaybackState } from '../../utils/playbackSlice';
import {PlaybackState} from "../../utils/playbackSlice";

interface IProps {
    token: string;
}

export default function Player(props: IProps) {

    const [token, setToken] = useState('');

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
              setPlaybackStateCallback={playbackCallback}
            />
            }
        </div>
    )
}
