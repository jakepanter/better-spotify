import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from "../../utils/constants";
import Button from "../Button/Button";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";

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

  async createNewPlaylist() {
    const data = {
      playlistName: "coole neue playlist",
      options: {
        description: "ne",
        collaborative: false,
        public: false,
      },
    };
    await fetch(`${API_URL}api/spotify/playlists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  render() {
    if (this.state.results.length === 0) return <p>loading...</p>;
    const playlists = this.state.results.map((playlist) => {
      return (
        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
          <li>
            {playlist.images.length > 0 ? (
              <img
                src={playlist.images[playlist.images.length - 1].url}
                alt="Playlist Image"
                width={64}
                height={64}
              />
            ) : (
              <CoverPlaceholder />
            )}
            <span>{playlist.name}</span>
          </li>
        </Link>
      );
    });

    return (
      <>
        <h2>My Playlists</h2>
        <Button onClick={this.createNewPlaylist}>New Playlist</Button>
        <div className={"Playlists"}>
          <ul>{playlists}</ul>
        </div>
      </>
    );
  }
}

export default Playlists;
