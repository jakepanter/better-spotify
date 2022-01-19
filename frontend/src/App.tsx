import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.scss";
import Albums from "./components/Albums/Albums";
import Playlists from "./components/Playlists/Playlists";
import SavedTracks from "./components/SavedTracks/SavedTracks";
import Player from "./components/Player/Player";
import { API_URL, AUTH_LOCAL_STORAGE_KEY } from "./utils/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import Topbar from "./components/Topbar/Topbar";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import TagTracklistPage from "./pages/TagTracklistPage/TagTracklistPage";
import SearchPage from "./components/SearchPage/SearchPage";
import SearchPageCustom from "./components/SearchPage/Custom/SearchPageCustom";
import Discover from "./components/Discover/Discover";
import SongHistory from "./components/SongHistory/SongHistory";
import Releases from "./components/Releases/Releases";
import RelatedArtistsPage from "./pages/RelatedArtistsPage/RelatedArtistsPage";
import { useSelector, useDispatch } from 'react-redux'
import { updateAuthentication } from './utils/authenticationSlice'


function authorize() {
  fetch(`${API_URL}api/spotify/get-auth-url`)
      .then((res) => res.text())
      .then((url) => {
        console.log(url);
        window.location.href = url;
      });
}

function getInitialAuth() {
  let initialAuth = {
    accessToken: '',
    refreshToken: '',
    expiresIn: ''
  };
  const localAuth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (localAuth === null) return initialAuth;
  const parsedAuth = JSON.parse(localAuth);
  if (parsedAuth.accessToken === '') return initialAuth;
  return parsedAuth;
}

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editable, setEditable] = useState(false);
  const [miniMenu, setMiniMenu] = useState(false);
  const [authorization, setAuthorization] = useState(getInitialAuth());

  const authentication = useSelector((state) => state.authentication.accessToken)
  const dispatch = useDispatch()

  const menuToggle = () => { setMiniMenu(!miniMenu)};

  const toggleEditable = () => setEditable(!editable);

  useEffect(() => {
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(authorization));
  }, [authorization]);

  useEffect(() => {
    if (authorization.refreshToken != '') {
      const refreshInterval = setInterval(async () => {
        const bearerToken = `Bearer ${authorization.refreshToken}`;
        fetch(`${API_URL}api/spotify/refresh-token`, {
          headers: {
            'Authorization': bearerToken
          }
        })
            .then(res => res.json())
            .then(res => res.body)
            .then(res => {
              setAuthorization({
                accessToken: res.access_token,
                refreshToken: authorization.refreshToken,
                expiresIn: res.expiresIn,
              })
            });
      }, parseInt(authorization.expiresIn) * 1000 - 10000);
      return () => clearInterval(refreshInterval);
    }
  }, [authorization]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const localAuthorization = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);

    const accessToken = queryParams.get('access_token') ? queryParams.get('access_token') as string : '';
    const refreshToken = queryParams.get('refresh_token') ? queryParams.get('refresh_token') as string : '';
    const expiresIn = queryParams.get('expires_in') ? queryParams.get('expires_in') as string : '';
    if (accessToken != '' && refreshToken != '' && expiresIn != '') {
      setAuthorization({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
      });
      setIsAuthorized(true);
    } else if (localAuthorization != null && JSON.parse(localAuthorization).accessToken != '') {
      setAuthorization(JSON.parse(localAuthorization));
      setIsAuthorized(true);
    } else {
      console.log('Could not authorize!');
    }
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
              <Route path="/tag/:id">
                <TagTracklistPage/>
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
            <Player token={authorization.accessToken} />
          </div>
        </div>
      </Router>
  );
}

export default App;
