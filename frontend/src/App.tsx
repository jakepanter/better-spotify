import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Albums from "./components/Albums/Albums";
import Playlists from "./components/Playlists/Playlists";
import Podcasts from "./components/Podcasts/Podcasts"
import SavedTracks from "./components/SavedTracks/SavedTracks";
import Player from "./components/Player/Player";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Topbar from "./components/Topbar/Topbar";
import SearchPage from "./components/SearchPage/SearchPage";
import ContextMenuWrapper from "./components/ContextMenu/ContextMenuWrapper";
import SearchPageCustom from "./components/SearchPage/Custom/SearchPageCustom";
import Discover from "./components/Discover/Discover";
import SongHistory from "./components/SongHistory/SongHistory";
import Releases from "./components/Releases/Releases";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import TagTracklistPage from "./pages/TagTracklistPage/TagTracklistPage";
import RelatedArtistsPage from "./pages/RelatedArtistsPage/RelatedArtistsPage";
import ShowPage from "./pages/ShowPage/ShowPage";
import EpisodePage from "./pages/EpisodePage/EpisodePage";
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
  const toggleEditable = () => setEditable(!editable);
  const [miniMenu, setMiniMenu] = useState(localStorage.getItem('miniMenu') === 'true' ? true : false);
  const menuToggle = () => setMiniMenu(!miniMenu);
  useEffect(() => {
    localStorage.setItem('miniMenu', String(miniMenu));
  }, [miniMenu]);

  const [lightmode, setLightmode] = useState(localStorage.getItem('lightmode') === 'true' ? true : false);
  const toggleLightmode = () => setLightmode(!lightmode);
  useEffect(() => {
    localStorage.setItem('lightmode', String(lightmode));
    }, [lightmode]);


  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    isOpen: false,
    type: "",
    x: null,
    y: null,
    data: null,
  });

  const authentication = useSelector((state: AuthState) => state.authentication)
  const dispatch = useDispatch()

  const state = {
    contextMenu: contextMenu,
    setContextMenu,
  };

  useEffect(() => {
    dispatch(getAuthentication());
  });

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(refreshAuthentication())
    }, 3600 * 1000 - 10000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    // disables default context menu
    document.addEventListener("contextmenu", (e) => e.preventDefault(), true);
  }, []);

  if (!authentication.accessToken || authentication.accessToken === '') {
    return (
        <AuthorizePage />
    );
  }

  return (
    <AppContext.Provider value={state}>
      <Router>
        <div className={`structure ${lightmode ? " light_mode" : ""} `}>
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
            <Topbar editable={editable} onChangeEditable={toggleEditable} lightTheme={lightmode} onChangeLightmode={toggleLightmode}/>
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
              <Route path="/show/:id">
                <ShowPage/>
              </Route>
              <Route path="/episode/:id">
                <EpisodePage/>
              </Route>
              <Route path="/collections/albums">
                <Albums />
              </Route>
              <Route path="/collections/podcasts">
                <Podcasts/>
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
            
            <Player token={authentication.accessToken} key={String(lightmode)} lightTheme={lightmode} />
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
