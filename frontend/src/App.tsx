import React, {useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Playlist from "./components/Playlist/Playlist";
import Playlists from "./components/Playlists/Playlists";
import Searchbar from "./components/Searchbar/Searchbar";
import SavedTracks from "./components/SavedTracks/SavedTracks"
import Player from "./components/Player/Player";
import {API_URL} from "./utils/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";

function authorize() {
  fetch(`${API_URL}api/spotify/get-auth-url`)
    .then((res) => res.text())
    .then((url) => {
      console.log(url);
      window.location.href = url;
    });
}

function App() {
  const [editable, setEditable] = useState(
    false
  );

  const toggleEditable = () => setEditable(!editable);

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
                            <button onClick={toggleEditable}>IsEditable: {editable ? 'true' : 'false'}</button>
                            <Dashboard editable={editable}/>
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
