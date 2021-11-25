import React from "react";
import {NavLink} from 'react-router-dom'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Playlist from "./components/Playlist/Playlist";
import Playlists from "./components/Playlists/Playlists";
import Searchbar from "./components/Searchbar/Searchbar";
import SavedTracks from "./components/SavedTracks/SavedTracks"
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
            <div className="structure">
                <div className="structure--left-panel">
                    <ul className="left-side-panel">
                        <li>
                            <NavLink exact activeClassName="active" className="button" to="/">
                                <span className="material-icons left-side-panel--icon">home</span>
                                <br />Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="/me/tracks">
                                <span className="material-icons left-side-panel--icon">favorite</span>
                                <br />Favorites
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="/playlists">
                                <span className="material-icons left-side-panel--icon">queue_music</span>
                                <br />Playlists
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="/collections/albums">
                                <span className="material-icons left-side-panel--icon">library_music</span>
                                <br />Albums
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="">
                                    <span className="material-icons left-side-panel--icon">grid_view</span>
                                    <br />Library
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="">
                                    <span className="material-icons left-side-panel--icon">manage_search</span>
                                    <br />Discover
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="button" to="">
                                    <span className="material-icons left-side-panel--icon">queue</span>
                                    <br />Queue
                            </NavLink>
                        </li>
                    </ul>

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
                </div>
            </div>
        </Router>
    );
}

export default App;
