import React from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import "./App.scss";
import Album from "./components/Album/Album";
import Albums from "./components/Albums/Albums";
import Searchbar from "./components/Searchbar/Searchbar";

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
        <Searchbar />
        <ul>
          <li>
            <Link className="button" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="button" to="/collections/albums">
              Saved Albums
            </Link>
          </li>
          <li>
            <button className="button" onClick={authorize}>
              Authorize
            </button>
          </li>
        </ul>

        <p>
          I just need to check the basic style, please feel free to delete this
          later
        </p>

        <Switch>
          <Route exact path="/">
            <h1>Works</h1>
          </Route>
          <Route path="/album/:id">
            <h1>Album</h1>
            <Album />
          </Route>
          <Route path="/collections/albums">
            <h1>Albums</h1>
            <Albums />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
