import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  CreatePlaylistResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from "../../utils/constants";
import Button from "../Button/Button";
import "../../cards.scss";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import { createNewPlaylist } from "../../helpers/api-helpers";

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

    this.handleCreateNewPlaylist = this.handleCreateNewPlaylist.bind(this);
  }

  async componentDidMount() {
    // Fetch playlists
    const data: ListOfUsersPlaylistsResponse = await fetch(
      `${API_URL}api/spotify/playlists`
    ).then((res) => res.json());
    // Save to state
    this.setState((state) => ({ ...state, results: data.items }));
  }

  async handleCreateNewPlaylist() {
    const number = this.state.results ? this.state.results.length + 1 : "-1";
    const options = {
      collaborative: false,
      public: false,
    };
    const newPlaylist: CreatePlaylistResponse = await createNewPlaylist(
      "coole neue playlist #" + number,
      options
    );
    const arr = [newPlaylist, ...this.state.results];
    this.setState((state) => ({
      ...state,
      results: arr,
    }));
  }

  render() {
    if (this.state.results.length === 0) return <p>loading...</p>;
    const playlists = this.state.results.map((playlist) => {
      return (
        <li className={"column"} key={playlist.id}>
          <Link to={`/playlist/${playlist.id}`}>
            {playlist.images.length > 0 ? (
              <div
                className={"cover"}
                style={{ backgroundImage: `url(${playlist.images[0].url})` }}
              />
            ) : (
              <CoverPlaceholder className="cover" />
            )}
            <span className={"title"}>{playlist.name}</span>
            <span className={"artists-name"}>
              by {playlist.owner.display_name}
            </span>
          </Link>
        </li>
      );
    });

    return (
      <div style={{ overflow: "hidden auto" }}>
        <h2>My Playlists</h2>
        <Button onClick={this.handleCreateNewPlaylist}>New Playlist</Button>
        <div className={"overview"}>
          <ul className={"overview-items"}>{playlists}</ul>
        </div>
      </div>
    );
  }
}

export default Playlists;
