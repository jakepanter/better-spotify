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
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import TagTracklistPage from "./pages/TagTracklistPage/TagTracklistPage";
import SearchPage from "./components/SearchPage/SearchPage";
import ContextMenuWrapper from "./components/ContextMenu/ContextMenuWrapper";
import SearchPageCustom from "./components/SearchPage/Custom/SearchPageCustom";
import Discover from "./components/Discover/Discover";
import SongHistory from "./components/SongHistory/SongHistory";
import Releases from "./components/Releases/Releases";
import RelatedArtistsPage from "./pages/RelatedArtistsPage/RelatedArtistsPage";
import AuthorizePage from "./components/AuthorizePage/AuthorizePage";
import AppContext, { ContextMenu } from "./AppContext";
import { useSelector, useDispatch } from 'react-redux';
import { getAuthentication, refreshAuthentication } from './utils/authenticationSlice';

type AuthState = {
  authentication: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  }
}


function App() {
  const [editable, setEditable] = useState(false);
  const [miniMenu, setMiniMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    isOpen: false,
    type: "",
    x: null,
    y: null,
    data: null,
  });

  const authentication = useSelector((state: AuthState) => state.authentication)
  const dispatch = useDispatch()

  const menuToggle = () => setMiniMenu(!miniMenu);

  const state = {
    contextMenu: contextMenu,
    setContextMenu,
  };

  const toggleEditable = () => setEditable(!editable);

  useEffect(() => {
    dispatch(getAuthentication());
  });

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(refreshAuthentication())
    }, 3600 * 1000 - 10000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (!authentication.accessToken || authentication.accessToken === '') {
    return (
        <AuthorizePage />
    );
  }

  return (
    <AppContext.Provider value={state}>
      <Router>
        <div className="structure">
          {contextMenu.isOpen && contextMenu.x && contextMenu.y && (
            <ContextMenuWrapper
              type={contextMenu.type}
              data={contextMenu.data}
              positionX={contextMenu.x}
              positionY={contextMenu.y}
            />
          )}
          {/* Minimize menu */}
          <button
            className={`minimizeMenuButton ${miniMenu ? "positionMenuButton" : ""}`}
            onClick={menuToggle}
          >
            {miniMenu ? (
              <p className="material-icons minimize-icon turned" title={"Maximize menu"}>
                chevron_left
              </p>
            ) : (
              <p className="material-icons minimize-icon" title={"Minimize menu"}>
                chevron_left
              </p>
            )}
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
                <SavedTracks headerStyle={"full"} />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/tag/:id">
                <TagTracklistPage />
              </Route>
              <Route path="/search/:search">
                <SearchPage />
              </Route>
              <Route path="/customsearch/:type/:search">
                <SearchPageCustom />
              </Route>
              <Route path="/discover">
                <Discover />
              </Route>
              <Route path="/song-history">
                <h1>Song History</h1>
                <SongHistory />
              </Route>
              <Route path="/new-releases">
                <h1>New Releases</h1>
                <Releases />
              </Route>
              <Route path="/related-artists/:id">
                <RelatedArtistsPage />
              </Route>
            </Switch>
            <Player token={authentication.accessToken} />
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
