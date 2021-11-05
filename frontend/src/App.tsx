import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.scss';
import Searchbar from "./components/Searchbar/Searchbar";
import SavedTracks from "./components/SavedTracks/SavedTracks"

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
        <ul>
          <li>
            <Link className="button" to="/">Home</Link>
          </li>
          <li>
            <button className="button" onClick={authorize}>Authorize</button>
          </li>
          <li>
            <Link className="button" to="/me/tracks">Saved Tracks</Link>
          </li>
        </ul>

        <p>I just need to check the basic style, please feel free to delete this later</p>

        <Switch>
          <Route path="/">
            <h1>Works</h1>
          </Route>
          <Route path="/me/tracks">
            <h1>Saved Tracks</h1>
            <SavedTracks/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
