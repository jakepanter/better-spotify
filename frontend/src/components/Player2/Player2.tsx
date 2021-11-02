import React, { useState, useEffect } from 'react';
import './Player2.scss';

interface IProps {
    token: string
}
interface IListenerProps { device_id: string; }
interface IListenerState {
    track_window: {
        current_track: Track
    }
    paused: boolean
}
interface Track {
    name: string,
    album: {
        images: [
            { url: string }
        ]
    },
    artists: [
        { name: string }
    ]
}

const track: Track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

// async function fetchToken() {
//     const token = await fetch(`http://localhost:5000/api/spotify/access-token`).then(res => res.json());
//     console.log(`token: ${token}`);
//     return token;
// }

function Player2(props: IProps) {
    const [is_paused, setPaused] = useState(false);
    // const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);


    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        // @ts-ignore
        window.onSpotifyWebPlaybackSDKReady = () => {

            // @ts-ignore
            const player = new window.Spotify.Player({
                name: 'Really Cool Spoootify',
                getOAuthToken: () => props.token,
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }: IListenerProps) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }: IListenerProps) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( (state: IListenerState) => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                // @ts-ignore
                // player.getCurrentState().then( (state) => {
                //     (!state)? setActive(false) : setActive(true)
                // });

            }));

            player.connect();

        };
    }, []);

    return (
        <>
            <div className="container">
                <div className="main-wrapper">

                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>

                        {(player &&
                            <button className="btn-spotify" onClick={() => { // @ts-ignore
                                player.previousTrack() }} >
                                &lt;&lt;
                            </button>
                        )}

                        {(player &&
                            <button className="btn-spotify" onClick={() => { // @ts-ignore
                                player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>
                        )}

                        {(player &&
                            <button className="btn-spotify" onClick={() => { // @ts-ignore
                                player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    // if (!is_active) {
    //     return (
    //         <>
    //             <div className="container">
    //                 <div className="main-wrapper">
    //                     <b> Instance not active. Transfer your playback using your Spotify app </b>
    //                 </div>
    //             </div>
    //         </>)
    // } else {
    //     return (
    //         <>
    //             <div className="container">
    //                 <div className="main-wrapper">
    //
    //                     <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
    //
    //                     <div className="now-playing__side">
    //                         <div className="now-playing__name">{current_track.name}</div>
    //                         <div className="now-playing__artist">{current_track.artists[0].name}</div>
    //
    //                         {(player &&
    //                         <button className="btn-spotify" onClick={() => { // @ts-ignore
    //                             player.previousTrack() }} >
    //                             &lt;&lt;
    //                         </button>
    //                         )}
    //
    //                         {(player &&
    //                         <button className="btn-spotify" onClick={() => { // @ts-ignore
    //                             player.togglePlay() }} >
    //                             { is_paused ? "PLAY" : "PAUSE" }
    //                         </button>
    //                         )}
    //
    //                         {(player &&
    //                         <button className="btn-spotify" onClick={() => { // @ts-ignore
    //                             player.nextTrack() }} >
    //                             &gt;&gt;
    //                         </button>
    //                         )}
    //                     </div>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }
}

export default Player2;
