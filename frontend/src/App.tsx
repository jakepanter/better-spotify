import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Playlist from "./components/Playlist/Playlist";
import Playlists from "./components/Playlists/Playlists";
import Searchbar from "./components/Searchbar/Searchbar";
import Player from "./components/Player/Player";

function authorize() {
  fetch(`http://localhost:5000/api/spotify/get-auth-url`)
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
        <Searchbar/>
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
        </Switch>
      </div>
      <div className="columns-test">
          <div className="column">Test</div>
          <div className="column">Test</div>
      </div>
    </Router>
  );
}

export default App;
