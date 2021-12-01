import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from '../../utils/constants';

interface IProps {}

interface IState {
  results: PlaylistObjectSimplified[];
}

class Playlists extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      results: [],
    };
  }

  async componentDidMount() {
    // Fetch playlists
    const data: ListOfUsersPlaylistsResponse = await fetch(
      `${API_URL}api/spotify/playlists`
    ).then((res) => res.json());
    // Save to state
    this.setState((state) => ({ ...state, results: data.items }));
  }

  render() {
    if (this.state.results.length === 0) return <p>loading...</p>;
    const playlists = this.state.results.map((playlist) => {
      return (
        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
          <li>
            <img
              src={playlist.images[playlist.images.length - 1].url}
              alt="Playlist Image"
              width={64}
              height={64}
            />
            <span>{playlist.name}</span>
          </li>
        </Link>
      );
    });

    return (
      <>
        <h2>My Playlists</h2>
        <div className={"Playlists"}>
          <ul className={"Playlist-items"}>{playlists}</ul>
        </div>
      </>
    );
  }
}

export default Playlists;
