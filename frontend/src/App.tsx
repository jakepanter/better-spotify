import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Playlist from "./components/Playlist/Playlist";
import Playlists from "./components/Playlists/Playlists";
import SavedTracks from "./components/SavedTracks/SavedTracks"
import Player from "./components/Player/Player";
import { API_URL } from "./utils/constants";
import Topbar from "./components/Topbar/Topbar";

function authorize() {
  fetch(`${API_URL}api/spotify/get-auth-url`)
    .then((res) => res.text())
    .then((url) => {
      console.log(url);
      window.location.href = url;
    });
}

function App() {
  return (
    <Router>
      <div>
        <Topbar />
        <Player/>
        <ul>
          <li>
            <Link className="button" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="button" to="/collections/albums">
              Saved Albums
            </Link>
          </li>
          <li>
            <Link className="button" to="/playlists">
              My Playlists
            </Link>
          </li>
          <li>
            <button className="button" onClick={authorize}>
              Authorize
            </button>
          </li>
          <li>
            <Link className="button" to="/me/tracks">Saved Tracks</Link>
          </li>
        </ul>
        
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          <Route path="/playlists">
            <Playlists />
          </Route>
          <Route path="/playlist/:id">
            <Playlist />
          </Route>
          <Route path="/album/:id">
            <h1>Album</h1>
            <Album />
          </Route>
          <Route path="/collections/albums">
            <h1>Albums</h1>
            <Albums />
          </Route>
          <Route path="/me/tracks">
            <h1>Saved Tracks</h1>
            <SavedTracks/>
          </Route>
        </Switch>
      </div>
      <div className="columns-test">
          <div className="column">Test</div>
          <div className="column">Test</div>
      </div>
      <div className="grid-test">
        <div className="grid-box">1</div>
        <div className="grid-box">2</div>
        <div className="grid-box">3</div>
        <div className="grid-box">4</div>

      </div>
    </Router>
  );
}

export default App;
