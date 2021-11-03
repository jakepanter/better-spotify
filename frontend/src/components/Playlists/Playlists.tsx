import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Playlists.scss";

interface IProps {}

interface IState {
  results: any[];
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
    const data = await fetch(
      `http://localhost:5000/api/spotify/playlists`
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
            <img src={playlist.images[0].url} alt="Playlist Image" width={64} />
            <span>{playlist.name}</span>
          </li>
        </Link>
      );
    });

    return (
      <>
        <h2>My Playlists</h2>
        <div className={"Playlists"}>
          <ul>{playlists}</ul>
        </div>
      </>
    );
  }
}

export default Playlists;
