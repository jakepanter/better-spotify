import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.scss';
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
        <Searchbar/>
        <ul>
          <li>
            <Link className="button" to="/">Home</Link>
          </li>
          <li>
            <button className="button" onClick={authorize}>Authorize</button>
          </li>
        </ul>

        <p>I just need to check the basic style, please feel free to delete this later</p>
        <div className="test">
          <div className="box">1</div>
          <div className="box">2</div>
          <div className="box">3</div>
          <div className="box">4</div>
          <div className="box">5</div>
          <div className="box">6</div>
          <div className="box">7</div>
          <div className="box">8</div>
          <div className="box">9</div>
          <div className="box">10</div>
          <div className="box">11</div>
          <div className="box">12</div>

        </div>
        <Switch>
          <Route path="/">
            <h1>Works</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
