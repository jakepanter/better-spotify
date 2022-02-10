import React, { Component } from "react";
import {
  TrackObjectFull,
  SingleArtistResponse,
  ArtistObjectFull,
  AlbumObjectSimplified,
  ArtistsTopTracksResponse,
  ArtistsAlbumsResponse, CheckUsersSavedTracksResponse,
} from "spotify-types";
import { API_URL } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Artist.scss";
import TrackList from "../TrackList/TrackList";
import { getAuthHeader } from "../../helpers/api-helpers";
import Card from "../Card/Card";
import AppContext from "../../AppContext";

//limit is the number of items which shall be fetched
//it also defines the number of artists in more like 'artist"
const limit = 6;

interface IProps {
  id: string;
}

export interface TopTrack extends TrackObjectFull {
  is_saved: boolean;
}

interface IState {
  artist: ArtistObjectFull;
  artistTopTracks: TrackObjectFull[];
  topTracks: TopTrack[];
  albums: AlbumObjectSimplified[];
  singles: AlbumObjectSimplified[];
  appearsOn: AlbumObjectSimplified[];
  compilations: AlbumObjectSimplified[];
  relatedArtists: ArtistObjectFull[];
  filter: string;
}



class Artist extends Component<IProps, IState> {
  static contextType = AppContext;

  constructor(props: IProps) {
    super(props);
    this.state = {
      artist: {} as ArtistObjectFull,
      artistTopTracks: [],
      topTracks: [],
      albums: [],
      singles: [],
      appearsOn: [],
      compilations: [],
      relatedArtists: [],
      filter: "All"
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  async componentDidMount() {
    //get country of user
    const country = localStorage.getItem("country");
    const authHeader = getAuthHeader();
    // fetch artist
    const artistData: SingleArtistResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState({ artist: artistData });

    //fetch artist top tracks
    const artistTopTracks: ArtistsTopTracksResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}/top-tracks`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState({ artistTopTracks: artistTopTracks.tracks });

    let saved: CheckUsersSavedTracksResponse = [];
    const savedTracks = this.state.artistTopTracks.map((i) => i.id);
    if(savedTracks.length !== 0){
      //check if tracks are liked
      saved = await fetch(
          `${API_URL}api/spotify/me/tracks/contains?trackIds=${savedTracks}`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
      ).then((res) => res.json());
    }
    const topTracks = this.state.artistTopTracks as TopTrack[];
    topTracks.map((t, i) => {
        t.is_saved = saved[i]
    });
    this.setState({topTracks: topTracks});


    // fetch albums
    const allAlbums: ArtistsAlbumsResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=${country}&include_groups=album`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState((state) => ({ ...state, albums: allAlbums.items }));

    // fetch singles
    const allSingles: ArtistsAlbumsResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=${country}&include_groups=single`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState((state) => ({ ...state, singles: allSingles.items }));

    // fetch albums where the artist appears on
    const allAppearsOn: ArtistsAlbumsResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=${country}&include_groups=appears_on`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState((state) => ({ ...state, appearsOn: allAppearsOn.items }));

    // fetch compilations
    const allCompilations: ArtistsAlbumsResponse = await fetch(
      `${API_URL}api/spotify/artist/${this.props.id}/albums?limit=${limit}&market=${country}&include_groups=compilation`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState((state) => ({ ...state, compilations: allCompilations.items }));

    // fet related artists
    const allRelatedArtists = await fetch(
      `${API_URL}api/spotify/artists/${this.props.id}/related-artists`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    ).then((res) => res.json());
    this.setState((state) => ({
      ...state,
      relatedArtists: allRelatedArtists.artists.slice(0, limit),
    }));
  }

  // this function will be called, when the user clicks on a filter
  handleFilterChange(value: string) {
    //the value of the filter-option will be set
    this.setState({ filter: value });
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

  render() {
    const { contextMenu, setContextMenu } = this.context;

    const artist =
      Object.keys(this.state.artist).length === 0 ? (
        <p>loading...</p>
      ) : (
        <div className="Content" style={{ padding: "1rem" }}>
          {this.state.artist.images.length > 0 ? (
            <div
              className={"cover"}
              style={{ backgroundImage: `url(${this.state.artist.images[0].url}` }}
            />
          ) : (
            <CoverPlaceholder />
          )}
          <p className={"Name"}>{this.state.artist.name}</p>
        </div>
      );

    // for albums
    const albums = this.state.albums.map((album, index) => (
      <Card
        key={album.id + index}
        item={album.id}
        linkTo={`/album/${album.id}`}
        imageUrl={album.images.length > 0 ? album.images[0].url : ""}
        title={album.name}
        subtitle={album.artists}
        handleRightClick={(e) =>
          this.handleRightClick(e, album, "albums", contextMenu, setContextMenu)
        }
      />
    ));

    // for singles
    const singles = this.state.singles.map((single, index) => (
      <Card
        key={single.id + index}
        item={single.id}
        linkTo={`/album/${single.id}`}
        imageUrl={single.images.length > 0 ? single.images[0].url : ""}
        title={single.name}
        subtitle={single.artists}
        handleRightClick={(e) =>
          this.handleRightClick(e, single, "albums", contextMenu, setContextMenu)
        }
      />
    ));

    // fetch albums where the artist appears on
    const appearsOnAlbum = this.state.appearsOn.map((album, index) => (
      <Card
        key={album.id + index}
        item={album.id}
        linkTo={`/album/${album.id}`}
        imageUrl={album.images.length > 0 ? album.images[0].url : ""}
        title={album.name}
        subtitle={album.artists}
        handleRightClick={(e) =>
          this.handleRightClick(e, album, "albums", contextMenu, setContextMenu)
        }
      />
    ));

    // for compilations
    const compilations = this.state.compilations.map((compilation, index) => (
      <Card
        key={compilation.id + index}
        item={compilation.id}
        linkTo={`/album/${compilation.id}`}
        imageUrl={compilation.images.length > 0 ? compilation.images[0].url : ""}
        title={compilation.name}
        subtitle={compilation.artists}
        handleRightClick={(e) =>
          this.handleRightClick(e, compilation, "albums", contextMenu, setContextMenu)
        }
      />
    ));

    // for related artists
    const relatedArtists = this.state.relatedArtists.map((relatedArtist) => (
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
    ));

    return (
      <div style={{ overflow: "hidden auto" }} key={this.props.id}>
        {/*Artist information*/}
        <div className={"ArtistSection"}>
          <h2 className={"Header"}>
            Artist
            {/*Filter*/}
            <div className="select">
              <select
                className={"input-select"}
                onChange={(e) => {
                  this.handleFilterChange(e.target.value);
                }}
              >
                <option value="All">Filter: All</option>
                {this.state.topTracks.length > 0 ? (
                  <option value="Discography">Discography</option>
                ) : (
                  <></>
                )}
                {albums.length > 0 ? <option value="Albums">Albums</option> : <></>}
                {singles.length > 0 ? <option value="Singles">Singles</option> : <></>}
                {appearsOnAlbum.length > 0 ? <option value="Appears-On">Appears On</option> : <></>}
                {compilations.length > 0 ? (
                  <option value="Compilations">Compilations</option>
                ) : (
                  <></>
                )}
                {relatedArtists.length > 0 ? (
                  <option value="More-like">More like {this.state.artist.name}</option>
                ) : (
                  <></>
                )}
              </select>
            </div>
          </h2>
          {artist}
        </div>

        {/*Discography - top tracks*/}
        {(this.state.filter === "Discography" || this.state.filter == "All") &&
        this.state.topTracks ? (
          <div className={"ArtistSection"}>
            <div className={"Header"}>
              <h2>
                Discography
                <NavLink to={`/artist/${this.props.id}/discography`} className={"ViewMoreLink"}>
                  View Entire Discography
                </NavLink>
              </h2>
            </div>
            <div style={{ margin: "0 1rem" }}>
              <TrackList
                type={"topTracks"}
                tracks={this.state.topTracks}
                loadMoreCallback={() => {}}
                fullyLoaded={true}
                id_tracklist={""}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*Albums*/}
        {(this.state.filter === "Albums" || this.state.filter == "All") && albums.length > 0 ? (
          <div className={"ArtistSection"} key={"album"}>
            <div className={"Header"}>
              <h2>
                Albums
                <NavLink to={`/artist/${this.props.id}/albums/album`} className={"ViewMoreLink"}>
                  View All
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{albums}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*Singles*/}
        {(this.state.filter === "Singles" || this.state.filter == "All") && singles.length > 0 ? (
          <div className={"ArtistSection"} key={"singles"}>
            <div className={"Header"}>
              <h2>
                Singles
                <NavLink to={`/artist/${this.props.id}/albums/single`} className={"ViewMoreLink"}>
                  View All
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{singles}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*Appears On*/}
        {(this.state.filter === "Appears-On" || this.state.filter == "All") &&
        appearsOnAlbum.length > 0 ? (
          <div className={"ArtistSection"} key="appearsOn">
            <div className={"Header"}>
              <h2>
                Appears on
                <NavLink
                  to={`/artist/${this.props.id}/albums/appears_on`}
                  className={"ViewMoreLink"}
                >
                  View All
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{appearsOnAlbum}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*Compilations*/}
        {(this.state.filter === "Compilations" || this.state.filter == "All") &&
        compilations.length > 0 ? (
          <div className={"ArtistSection"} key="compilations">
            <div className={"Header"}>
              <h2>
                Compilations
                <NavLink
                  to={`/artist/${this.props.id}/albums/compilation`}
                  className={"ViewMoreLink"}
                >
                  View All
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{compilations}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*More like "Artist"*/}
        {(this.state.filter === "More-like" || this.state.filter == "All") &&
        relatedArtists.length > 0 ? (
          <div className={"ArtistSection"}>
            <div className={"Header"}>
              <h2>
                More like &quot;{this.state.artist.name}&quot;
                <NavLink to={`/related-artists/${this.props.id}`} className={"ViewMoreLink"}>
                  View More
                </NavLink>
              </h2>
            </div>
            <div className={"Content"}>
              <div className={"CoverList"}>{relatedArtists}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Artist;
