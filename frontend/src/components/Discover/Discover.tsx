import React, {Component} from 'react';
import {

    PlayHistoryObject,
    UsersRecentlyPlayedTracksResponse,
    AlbumObjectSimplified,
    //ListOfNewReleasesResponse
} from "spotify-types";
import './Discover.scss';
import {API_URL} from "../../utils/constants";
import {Link} from "react-router-dom";

interface IProps {
}

interface IState {
    recentTracks: PlayHistoryObject[];
    newReleases: AlbumObjectSimplified[];
}

class Discover extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            recentTracks: [],
            newReleases: [],
        };

    }

    async componentDidMount() {
        // Fetch recently played tracks
        console.log("-------HERE------");
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?limit=5`
        ).then((res) => res.json());
        // Save to state
        //console.log(data);
        this.setState((state) => ({...state, recentTracks: recentPlayedTracksData.items}));

        //console.log(this.state.recentTracks);

        // Fetch new releases

        const newReleasedAlbums: any = await fetch(
        `${API_URL}api/spotify/browse/new-releases?limit=5`
        ).then((res) => res.json());

        this.setState((state) => ({...state, newReleases: newReleasedAlbums.albums.items}));
        console.log(this.state.newReleases);


    }

    render() {
        if (this.state.recentTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentTracks.map((recentlyPlayedTrack) => {
            //console.log(recentlyPlayedTrack);
            return (
                <Link to={`/album/${recentlyPlayedTrack.track.album.id}`} key={recentlyPlayedTrack.played_at}>

                    <li>
                        <img
                            src={recentlyPlayedTrack.track.album.images[0].url}
                            alt="Playlist Image"
                            width={64}
                            height={64}
                        />
                        <span style={{color: "white"}}>{recentlyPlayedTrack.track.name}</span>
                    </li>
                </Link>
            );
        });

        if (this.state.newReleases.length === 0) return <p>loading...</p>;
        const tmp = this.state.newReleases.map((newReleasedAlbum) => {
            return (
                <Link to={`/album/${newReleasedAlbum.id}`} key={newReleasedAlbum.id}>
                    <li>
                        <img
                        src={newReleasedAlbum.images[0].url}
                        alt="Playlist Image"
                        width={64}
                        height={64}
                        />
                    <span style={{color: "white"}}>{newReleasedAlbum.name}</span>
                    </li>
                </Link>
            );
        })



        return (
            <>
                <div className={"recentlyPlayedTrackList"}>
                    <h3>Recently listened to</h3>
                    <button style={{float: "right"}}>View More</button>
                    <ul>{recentlyPlayedList}</ul>
                </div>

                <div className={"newReeleases"}>
                    <h3>New Releases</h3>
                    <ul>{tmp}</ul>
                </div>
            </>
        );
    }
}

export default Discover;