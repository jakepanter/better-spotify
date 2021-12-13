import React, {Component} from 'react';
import {

    PlayHistoryObject
} from "spotify-types";
import './Discover.scss';
import {API_URL} from "../../utils/constants";
import {Link} from "react-router-dom";

interface IProps {}
interface IState {
    recentTracks: PlayHistoryObject[] ;
}

class Discover extends Component<IProps,IState> {

    constructor(props: IProps){
        super(props);

        this.state = {
            recentTracks: [],
        };

    }

    async componentDidMount(){
        // Fetch recently playes tracks
        console.log("-------HERE------");
    const data:any = await fetch(
        `${API_URL}api/spotify/player/recently-played`
      ).then((res) => res.json());
      // Save to state
        console.log(data);
      this.setState((state) => ({ ...state, recentTracks: data.items }));

      console.log(this.state.recentTracks);
    }

    render(){
        if (this.state.recentTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentTracks.map((recentlyPlayedTrack) => {
            console.log(recentlyPlayedTrack);
            return (
                <Link to={`/album/${recentlyPlayedTrack.track.album.id}`} key={recentlyPlayedTrack.played_at}>

                    <li>
                        <img
                            src={recentlyPlayedTrack.track.album.images[0].url}
                            alt="Playlist Image"
                            width={64}
                            height={64}
                        />
                        <span style={{color:"white"}}>{recentlyPlayedTrack.track.name}</span>
                    </li>
                </Link>
            );
        });

        return (
            <>
                <div className={"recentlyPlayedTrackList"}>
                    <h3>Recently listened to</h3>
                    <ul>{recentlyPlayedList}</ul>
                </div>
            </>
        );
    }
}

export default Discover;