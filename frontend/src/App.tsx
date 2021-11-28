import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Playlist from "./components/Playlist/Playlist";
import Playlists from "./components/Playlists/Playlists";
import Searchbar from "./components/Searchbar/Searchbar";
import SavedTracks from "./components/SavedTracks/SavedTracks"
import Player from "./components/Player/Player";

import Sidebar from "./components/Sidebar/Sidebar";


function authorize() {
    fetch(`http://localhost:5000/api/spotify/get-auth-url`)
        .then((res) => res.text())
        .then((url) => {
            console.log(url);
            window.location.href = url;
        });

import { API_URL } from "./utils/constants";

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
            <div className="structure">
                <div className="structure--left-panel">
                    <Sidebar/>
                </div>
                <div className="structure--main">
                    <Searchbar/>
                    <Player/>
                    <ul>
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
                            <Playlists/>
                        </Route>
                        <Route path="/playlist/:id">
                            <Playlist/>
                        </Route>
                        <Route path="/album/:id">
                            <h1>Album</h1>
                            <Album/>
                        </Route>
                        <Route path="/collections/albums">
                            <h1>Albums</h1>
                            <Albums/>
                        </Route>
                        <Route path="/me/tracks">
                            <h1>Saved Tracks</h1>
                            <SavedTracks/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
