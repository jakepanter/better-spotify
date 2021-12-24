import React, {Component} from 'react';
import {
    PlayHistoryObject,
    UsersRecentlyPlayedTracksResponse,
    AlbumObjectSimplified, TrackObjectFull,
    ListOfNewReleasesResponse
} from "spotify-types";
import './Discover.scss';
import {API_URL} from "../../utils/constants";
import {NavLink, Link} from "react-router-dom";

//TODO
// Filter vor available country? for new releases

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
        const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await fetch(
            `${API_URL}api/spotify/player/recently-played?limit=5`
        ).then((res) => res.json());
        // Save to state
        this.setState((state) => ({...state, recentTracks: recentPlayedTracksData.items}));


        // Fetch new releases

        const newReleasedAlbums: ListOfNewReleasesResponse = await fetch(
            `${API_URL}api/spotify/browse/new-releases?limit=5`
        ).then((res) => res.json());
        console.log(newReleasedAlbums);
        this.setState((state) => ({...state, newReleases: newReleasedAlbums.albums.items}));


    }

    render() {
        if (this.state.recentTracks.length === 0) return <p>loading...</p>;
        const recentlyPlayedList = this.state.recentTracks.map((recentlyPlayedTrack) => {
            const track = recentlyPlayedTrack.track as TrackObjectFull;
            return (
                <li className={"column"} key={recentlyPlayedTrack.played_at}>
                    <Link to={`/album/${track.album.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${track.album.images[0].url})`
                        }}>
                        </div>
                        <span className={"title"}>{track.name}</span>
                    </Link>
                </li>
            );
        });

        if (this.state.newReleases.length === 0) return <p>loading...</p>;
        const releases = this.state.newReleases.map((newReleasedAlbum) => {
            return (
                <li className="column" key={newReleasedAlbum.id}>
                    <Link to={`/album/${newReleasedAlbum.id}`}>
                        <div className={"cover"} style={{
                            backgroundImage: `url(${newReleasedAlbum.images[0].url})`
                        }}>
                        </div>
                        <span className="title">{newReleasedAlbum.name}</span>
                    </Link>
                </li>
            );
        });


        return (
            <>
                {/*Recently Played Tracks*/}
                <div className={"recentlyPlayedTrackList"}>
                    <h3>Recently listened to</h3>
                    <NavLink to="/song-history">View More</NavLink>
                    <div className={"overview"}>
                        <ul className={"overview-items"}
                            style={{height: '40vh', overflow: 'hidden'}}>{recentlyPlayedList}</ul>
                    </div>

                </div>

                {/*New Releases*/}
                <div className={"newReleases"}>
                    <h3>New Releases</h3>
                    <NavLink to="/new-releases">View More</NavLink>
                    <div className={"overview"}>
                        <ul className={"overview-items"} style={{height: '40vh', overflow: 'hidden'}}>{releases}</ul>
                    </div>
                </div>
            </>
        );
    }
}

export default Discover;