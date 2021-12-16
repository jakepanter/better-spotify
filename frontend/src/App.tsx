import "./App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Albums from "./components/Albums/Albums";
import Playlists from "./components/Playlists/Playlists";
import SavedTracks from "./components/SavedTracks/SavedTracks";
import Player from "./components/Player/Player";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import Topbar from "./components/Topbar/Topbar";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => setEditable(!editable);

  useEffect(() => {
    async function getAccessToken() {
      const res = await fetch(
        `http://localhost:5000/api/spotify/access-token`
      ).then((res) => res.json());
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
              <SavedTracks headerStyle={'full'}/>
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
