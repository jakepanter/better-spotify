import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Albums from "./components/Albums/Albums";
import Playlists from "./components/Playlists/Playlists";
import Searchbar from "./components/Searchbar/Searchbar";
import SavedTracks from "./components/SavedTracks/SavedTracks";
import Player from "./components/Player/Player";
import { API_URL } from "./utils/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import Discover from "./components/Discover/Discover";
import SongHistory from "./components/SongHistory/SongHistory";
import Releases from "./components/Releases/Releases";


function authorize() {
  fetch(`${API_URL}api/spotify/get-auth-url`)
    .then((res) => res.text())
    .then((url) => {
      console.log(url);
      window.location.href = url;
    });
}

function App() {
  const [editable, setEditable] = useState(false);
  const toggleEditable = () => setEditable(!editable);

  return (
    <Router>
      <div className="structure">
        <div className="structure--left-panel">
          <Sidebar />
        </div>
        <div className="structure--main">
          <Searchbar />
          <Player />
          <button className="AuthorizeButton button" onClick={authorize}>
            Authorize
          </button>
          <Switch>
            <Route exact path="/">
              <button
                className={"button"}
                onClick={toggleEditable}
                style={{ position: "fixed", right: "100px", top: 0 }}
              >
                <span className={"material-icons"}>
                  {editable ? "close" : "edit"}
                </span>
              </button>
              <Dashboard editable={editable} />
            </Route>
            <Route path="/playlists">
              <Playlists />
            </Route>
            <Route path="/playlist/:id">
              <PlaylistPage />
            </Route>
            <Route path="/album/:id">
              <AlbumPage />
            </Route>
            <Route path="/collections/albums">
              <Albums />
            </Route>
            <Route path="/me/tracks">
              <h1>Saved Tracks</h1>
              <SavedTracks />
            </Route>
            <Route path="/discover">
              <h1>Discover</h1>
              <Discover/>
            </Route>
            <Route path="/song-history">
              <h1>Song History</h1>
              <SongHistory/>
            </Route>
            <Route path="/new-releases">
              <h1>New Releases</h1>
              <Releases/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
