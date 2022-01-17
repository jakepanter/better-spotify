import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  CreatePlaylistResponse,
  ListOfUsersPlaylistsResponse,
  PlaylistObjectSimplified,
} from "spotify-types";
import "./Playlists.scss";
import { API_URL } from "../../utils/constants";
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
        <Link to={`/playlist/${playlist.id}`}
              className={'Card'}
              key={playlist.id}
        >
          {playlist.images.length > 0 ? (
            <div
              className={"CardCover"}
              style={{ backgroundImage: `url(${playlist.images[0].url})` }}
            />
          ) : (
            <CoverPlaceholder className="CardCover" />
          )}
          <span className={"CardTitle"}>{playlist.name}</span>
          <span className={"CardArtist"}>{playlist.owner.display_name}</span>
        </Link>
      );
    });

    return (
    <div className={'Playlists'}>
      <h2 className={'Header'}>
        Playlists
        <button className="add-button" onClick={this.handleCreateNewPlaylist}>
          <span className="material-icons">add</span>
          <span className="text">New Playlist</span>
        </button>
      </h2>
      <div className={'Content'}>
        <div className={'CoverList'}>{playlists}</div>
      </div>
    </div>
    );
  }
}

export default Playlists;
