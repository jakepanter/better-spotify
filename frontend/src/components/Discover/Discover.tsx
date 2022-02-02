import React, { Component } from "react";
import {
  PlayHistoryObject,
  UsersRecentlyPlayedTracksResponse,
  AlbumObjectSimplified,
  TrackObjectFull,
  ArtistObjectFull,
  ListOfNewReleasesResponse,
} from "spotify-types";
import "./Discover.scss";
import { API_URL } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import { formatTimeDiff } from "../../utils/functions";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";

interface IProps {}

interface IState {
  // recently played tracks are stored
  recentlyPlayedTracks: PlayHistoryObject[];
  // new releases are stored
  newReleases: AlbumObjectSimplified[];
  // artist and their related artists are stored
  relatedArtistsList: {
    artist: ArtistObjectFull;
    relatedArtists: ArtistObjectFull[];
  }[];
}

const limit = 5;

class Discover extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      recentlyPlayedTracks: [],
      newReleases: [],
      relatedArtistsList: [],
    };
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  async componentDidMount() {
    // fetch reently played tracks
    this.fetchRecentlyPlayedTracks().then((recentPlayedTracksData) => {
      // Save to state
      this.setState((state) => ({ ...state, recentlyPlayedTracks: recentPlayedTracksData.items }));
    });

    // fetch new releases
    this.fetchNewReleases().then((newReleasedAlbums) => {
      this.setState((state) => ({ ...state, newReleases: newReleasedAlbums.albums.items }));
    });

    // fetch related artist of top three artists
    this.fetchTopArtists().then((topArtists) => {
      //slice top three artists
      const topThreeArtists: ArtistObjectFull[] = topArtists.items
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      topThreeArtists.map((topArtist) => {
        this.fetchRelatedArtists(topArtist.id).then((relatedArtists) => {
          const fiveRelatedArtists = relatedArtists.artists
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          const list = {
            artist: topArtist,
            relatedArtists: fiveRelatedArtists,
          };
          this.setState({ relatedArtistsList: [...this.state.relatedArtistsList, list] });
        });
      });
    });
  }

  async fetchRecentlyPlayedTracks() {
    const authHeader = getAuthHeader();
    const res = await fetch(`${API_URL}api/spotify/player/recently-played?limit=${limit}`, {
      headers: {
        Authorization: authHeader,
      },
    });
    const recentPlayedTracksData: UsersRecentlyPlayedTracksResponse = await res.json();
    return recentPlayedTracksData;
  }

  async fetchNewReleases() {
    const authHeader = getAuthHeader();
    const country = localStorage.getItem("country");
    const res = await fetch(
      `${API_URL}api/spotify/browse/new-releases?country=${country}&limit=${limit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    const newReleasedAlbums: ListOfNewReleasesResponse = await res.json();
    return newReleasedAlbums;
  }

  async fetchTopArtists() {
    const authHeader = getAuthHeader();
    // Fetch top artists
    const res = await fetch(`${API_URL}api/spotify/me/top/artists`, {
      headers: {
        Authorization: authHeader,
      },
    });
    const topArtists = await res.json();
    return topArtists;
  }

  async fetchRelatedArtists(artistId: string) {
    const authHeader = getAuthHeader();
    const res = await fetch(`${API_URL}api/spotify/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: authHeader,
      },
    });
    const relatedArtists = await res.json();
    return relatedArtists;
  }

  handleRightClick() {
    console.log("clicky");
  }

  render() {
    // for recently played tracks
    if (this.state.recentlyPlayedTracks.length === 0) return <p>loading...</p>;
    const recentlyPlayedList = this.state.recentlyPlayedTracks.map((recentlyPlayedTrack) => {
      const track = recentlyPlayedTrack.track as TrackObjectFull;
      return (
        <Card
          key={recentlyPlayedTrack.played_at}
          item={track.album.id}
          linkTo={`/album/${track.album.id}`}
          imageUrl={track.album.images[0] !== null ? track.album.images[0].url : ""}
          title={track.name}
          subtitle={track.album.artists.map((a) => a.name).join(", ")}
          handleRightClick={this.handleRightClick}
        />
      );
    });

    // for new releases
    if (this.state.newReleases.length === 0) return <p>loading...</p>;
    const releases = this.state.newReleases.map((newReleasedAlbum) => (
      <Card
        key={newReleasedAlbum.id}
        item={newReleasedAlbum.id}
        linkTo={`/album/${newReleasedAlbum.id}`}
        imageUrl={newReleasedAlbum.images[0] !== null ? newReleasedAlbum.images[0].url : ""}
        title={newReleasedAlbum.name}
        subtitle={newReleasedAlbum.artists.map((a) => a.name).join(", ")}
        subsubtitle={formatTimeDiff(new Date(newReleasedAlbum.release_date).getTime(), Date.now())}
        handleRightClick={this.handleRightClick}
      />
    ));

    //for related artists
    if (this.state.relatedArtistsList.length === 0) return <p>loading...</p>;
    const relatedArtists = this.state.relatedArtistsList.map((relatedArtistsListItem) => {
      const relatedArtistsForOneArtist = relatedArtistsListItem.relatedArtists.map(
        (relatedArtist) => (
          <Card
            key={relatedArtist.id}
            item={relatedArtist.id}
            linkTo={`/artist/${relatedArtist.id}`}
            imageUrl={relatedArtist.images.length > 0 ? relatedArtist.images[0].url : ""}
            title={relatedArtist.name}
            handleRightClick={this.handleRightClick}
            roundCover={true}
          />
        )
      );
      return relatedArtistsForOneArtist;
    });

    return (
      <>
        <h2>Discover</h2>
        <div style={{ overflow: "hidden auto" }}>
          {/*Recently Played Tracks*/}
          <div className={"Discover"} key="recentlyPlayed">
            <div className={"Header"}>
              <h2>
                Recently listened to
                <NavLink to={"/song-history"} className="ViewMoreLink">
                  View More
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{recentlyPlayedList}</div>
            </div>
          </div>

          {/*New Releases*/}
          <div className={"Discover"} key="newReleases">
            <div className={"Header"}>
              <h2>
                New Releases
                <NavLink to={"/new-releases"} className="ViewMoreLink">
                  View More
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{releases}</div>
            </div>
          </div>

          {/*More like "artist"*/}
          {relatedArtists.map((tmp, index) => (
            <div className={"Discover"} key={this.state.relatedArtistsList[index].artist.id}>
              <div key={this.state.relatedArtistsList[index].artist.id}>
                <div className={"Header"}>
                  <h2>
                    More like &quot;{this.state.relatedArtistsList[index].artist.name}&quot;
                    <NavLink
                      to={`/related-artists/${this.state.relatedArtistsList[index].artist.id}`}
                      className="ViewMoreLink"
                    >
                      View More
                    </NavLink>
                  </h2>
                </div>
                <div className="Content">
                  <div className={"CoverList"}>{tmp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default Discover;
