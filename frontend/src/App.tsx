import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.scss';

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
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <button onClick={authorize}>Authorize</button>
          </li>
        </ul>

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
