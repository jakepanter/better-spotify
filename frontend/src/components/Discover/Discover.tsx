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
import AppContext from "../../AppContext";

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

//limit is the number of items which shall be fetched
//it also defines the number of artists in more like 'artist"
const limit = 6;

class Discover extends Component<IProps, IState> {
  static contextType = AppContext;

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
      // Following source is used to sort the array randomly: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      //slice top three artists
      const topThreeArtists: ArtistObjectFull[] = topArtists.items
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      topThreeArtists.map((topArtist) => {
        this.fetchRelatedArtists(topArtist.id).then((relatedArtists) => {
          const fiveRelatedArtists = relatedArtists.artists
            .sort(() => 0.5 - Math.random())
            .slice(0, limit);
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
    const res = await fetch(`${API_URL}api/spotify/player/recently-played?limit=${limit * 2}`, {
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

  handleRightClick(e: any, item: any, type: string, contextMenu: any, setContextMenu: any) {
    setContextMenu({
      ...contextMenu,
      type: type,
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      data: item,
    });
  }

  removeDuplicates(tracks: PlayHistoryObject[]): PlayHistoryObject[] {
    // Credit for removing duplicates: https://dev.to/coachmatt_io/comment/8hdm
    const seen = new Set();
    const filteredArr = tracks.filter((el) => {
      const duplicate = seen.has(el.track.id);
      seen.add(el.track.id);
      return !duplicate;
    });
    return filteredArr;
  }

  render() {
    const { contextMenu, setContextMenu } = this.context;
    // for recently played tracks
    const recentlyPlayedList =
      this.state.recentlyPlayedTracks.length === 0 ? (
        <p>loading...</p>
      ) : (
        this.removeDuplicates(this.state.recentlyPlayedTracks).map((recentlyPlayedTrack, index) => {
          if (index >= limit) return null;
          const track = recentlyPlayedTrack.track as TrackObjectFull;
          return (
            <Card
              key={recentlyPlayedTrack.played_at}
              item={track.album.id}
              linkTo={`/album/${track.album.id}`}
              imageUrl={track.album.images.length > 0 ? track.album.images[0].url : ""}
              title={track.name}
              subtitle={track.album.artists}
              handleRightClick={(e) =>
                this.handleRightClick(
                  e,
                  [track.uri + "-1"],
                  "tracklist-album",
                  contextMenu,
                  setContextMenu
                )
              }
            />
          );
        })
      );

    // for new releases
    const releases =
      this.state.newReleases.length === 0 ? (
        <p>loading...</p>
      ) : (
        this.state.newReleases.map((newReleasedAlbum, index) => {
          if (index >= limit) return null;
          return (
            <Card
              key={newReleasedAlbum.id}
              item={newReleasedAlbum.id}
              linkTo={`/album/${newReleasedAlbum.id}`}
              imageUrl={newReleasedAlbum.images.length > 0 ? newReleasedAlbum.images[0].url : ""}
              title={newReleasedAlbum.name}
              subtitle={newReleasedAlbum.artists}
              subsubtitle={formatTimeDiff(
                new Date(newReleasedAlbum.release_date).getTime(),
                Date.now()
              )}
              handleRightClick={(e) =>
                  this.handleRightClick(e, newReleasedAlbum, "albums", contextMenu, setContextMenu)
              }
            />
          );
        })
      );

    //for related artists
    const relatedArtists =
      this.state.relatedArtistsList.length === 0
        ? null
        : this.state.relatedArtistsList.map((relatedArtistsListItem) => {
            const relatedArtistsForOneArtist = relatedArtistsListItem.relatedArtists.map(
              (relatedArtist, index) => {
                if (index >= limit) return null;
                return (
                  <Card
                    key={relatedArtist.id}
                    item={relatedArtist.id}
                    linkTo={`/artist/${relatedArtist.id}`}
                    imageUrl={relatedArtist.images.length > 0 ? relatedArtist.images[0].url : ""}
                    title={relatedArtist.name}
                    handleRightClick={(e) =>
                        this.handleRightClick(e, relatedArtist, "", contextMenu, setContextMenu)
                    }
                    roundCover={true}
                  />
                );
              }
            );
            return relatedArtistsForOneArtist;
          });

    return (
      <>
        <h2 className={"Header"}>Discover</h2>
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
          {relatedArtists &&
            relatedArtists.map((tmp, index) => (
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
