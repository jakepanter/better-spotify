import React, { Component } from "react";
import {
  ArtistObjectFull,
  ArtistsRelatedArtistsResponse,
  SingleArtistResponse,
} from "spotify-types";
import { API_URL } from "../../utils/constants";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

interface IProps {
  id: string;
}

interface IState {
  artistName: string;
  relatedArtistsList: ArtistObjectFull[];
}

class RelatedArtists extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      relatedArtistsList: [],
      artistName: "",
    };
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  async componentDidMount() {
    // Fetch playlists
    const authHeader = getAuthHeader();
    const relatedArtists: ArtistsRelatedArtistsResponse = await fetch(
      `${API_URL}api/spotify/artists/${this.props.id}/related-artists`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    // Save to state
    this.setState((state) => ({ ...state, relatedArtistsList: relatedArtists.artists }));

    const artist: SingleArtistResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    // Save to state
    this.setState((state) => ({ ...state, artistName: artist.name }));
  }

  handleRightClick() {
    console.log("right");
  }

  render() {
    const relatedArtists =
      this.state.relatedArtistsList.length === 0 ? (
        <p>loading...</p>
      ) : (
        this.state.relatedArtistsList.map((artist) => (
          <Card
            key={artist.id}
            item={artist.id}
            linkTo={`/artist/${artist.id}`}
            imageUrl={artist.images[0] !== null ? artist.images[0].url : ""}
            title={artist.name}
            handleRightClick={this.handleRightClick}
            roundCover={true}
          />
        ))
      );

    return (
      <>
        <h2 className="Header">More Like &quot;{this.state.artistName}&quot;</h2>
        <div style={{ overflow: "hidden auto" }}>
          <div className={"Content"}>
            <div className={"CoverList"}>{relatedArtists}</div>
          </div>
        </div>
      </>
    );
  }
}

export default RelatedArtists;
