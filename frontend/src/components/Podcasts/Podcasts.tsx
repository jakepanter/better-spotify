import React, { Component } from "react";
import "./Podcasts.scss";
import {
  UsersSavedShowsResponse,
  MultipleShowsResponse,
  ShowObjectSimplified,
} from "spotify-types";
import "../../cards.scss";
import { API_URL } from "../../utils/constants";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

interface IProps {}

interface IState {
  results: ShowObjectSimplified[];
}

class Podcasts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      results: [],
    };
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleRightClick() {
    console.log("clicked");
  }

  async componentDidMount() {
    // Fetch playlists
    const shows: ShowObjectSimplified[] = [];

    // fetching saved Shows of Users
    const authHeader = getAuthHeader();
    const data: UsersSavedShowsResponse = await fetch(`${API_URL}api/spotify/me/shows`, {
      headers: {
        Authorization: authHeader,
      },
    }).then((res) => res.json());
    if (data.items.length > 0) {
      data.items.map((savedShow) => {
        shows.push(savedShow.show);
      });
    }

    // Fallback if User doesn't have any shows saved
    else if (data.items.length == 0) {
      const fallbackShows =
        "4QwUbrMJZ27DpjuYmN4Tun%2C1OLcQdw2PFDPG1jo3s0wbp%2C7BTOsF2boKmlYr76BelijW%2C6wPqbSlsvoi3Rgjjc2Sn4R%2C5m4Ll1qIBX29cTd0T9WwKp";
      const fallback: MultipleShowsResponse = await fetch(
        `${API_URL}api/spotify/shows?showIds=${fallbackShows}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      ).then((res) => res.json());
      fallback.shows.map((savedShow) => {
        shows.push(savedShow);
      });
    }
    this.setState((state) => ({ ...state, results: shows }));
  }

  render() {
    if (this.state.results.length === 0) return <p>loading...</p>;
    const shows = this.state.results.map((savedShow) => {
      return (
        <Card
          key={savedShow.id}
          item={savedShow.id}
          linkTo={`/show/${savedShow.id}`}
          imageUrl={savedShow.images.length > 0 ? savedShow.images[0].url : ""}
          title={savedShow.name}
          subtitle={savedShow.publisher}
          handleRightClick={this.handleRightClick}
        />
      );
    });
    if (this.state.results)
      return (
        <div className={"Shows"}>
          <h2 className={"Header"}>Podcasts</h2>
          <div className={"Content"}>
            <div className={"CoverList"}>{shows}</div>
          </div>
        </div>
      );
  }
}

export default Podcasts;
