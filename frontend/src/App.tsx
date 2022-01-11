import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Albums from "./components/Albums/Albums";
import Playlists from "./components/Playlists/Playlists";
import SavedTracks from "./components/SavedTracks/SavedTracks";
import Player from "./components/Player/Player";
import { API_URL } from "./utils/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import Topbar from "./components/Topbar/Topbar";
import SearchPage from "./components/SearchPage/SearchPage";
import SearchPageCustom from "./components/SearchPage/Custom/SearchPageCustom"
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import Discover from "./components/Discover/Discover";
import SongHistory from "./components/SongHistory/SongHistory";
import Releases from "./components/Releases/Releases";
import RelatedArtistsPage from "./pages/RelatedArtistsPage/RelatedArtistsPage";

function authorize() {
  fetch(`${API_URL}api/spotify/get-auth-url`)
      .then((res) => res.text())
      .then((url) => {
        console.log(url);
        window.location.href = url;
      });
}

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editable, setEditable] = useState(false);
  const [miniMenu, setMiniMenu] = useState(false);
  const menuToggle = () => { setMiniMenu(!miniMenu)};

  const toggleEditable = () => setEditable(!editable);

  useEffect(() => {
    async function getAccessToken() {
      const res = await fetch(`${API_URL}api/spotify/access-token`)
          .then((res) => res.json());
      setIsAuthorized(res !== undefined);
    }
    getAccessToken();
  }, []);

  if (!isAuthorized) {
    //possible TODO: Login Page
    return (
      <button className="button" onClick={authorize}>
        Log in with Spotify
      </button>
    );
  }

  return (
      <Router>
        <div className="structure">
          {/* Minimize menu */}
          <button className={`minimizeMenuButton ${miniMenu ? "positionMenuButton" : ""}`} onClick={menuToggle}>{miniMenu ?
              <p className="material-icons minimize-icon turned" title={"Maximize menu"} >chevron_left</p> :
              <p className="material-icons minimize-icon" title={"Minimize menu"} >chevron_left</p>}
          </button>
          <div className={`structure--left-panel ${miniMenu ? "minimizeMenu" : ""}`}>
            <Sidebar />
          </div>
          <div className="structure--main">
            <Topbar editable={editable} onChangeEditable={toggleEditable} />
            <Switch>
              <Route exact path="/">
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
                <SavedTracks headerStyle={'full'}/>
              </Route>
              <Route path="/settings">
                <SettingsPage/>
              </Route>
              <Route path="/search/:search">
                <SearchPage/>
              </Route>
              <Route path="/customsearch/:type/:search">
                <SearchPageCustom/>
              </Route>
                <Route path="/discover">
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
                <Route path="/related-artists/:id">
                    <RelatedArtistsPage />
                </Route>
            </Switch>
            <Player />
          </div>
        </div>
      </Router>
  );
}

export default App;
