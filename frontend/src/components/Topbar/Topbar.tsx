import React from "react";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";
import 'rc-slider/assets/index.css';
import Volume from "./Volume";

const Topbar = () => {
  return (
      <div className={'top-bar'}>
          <div className={'top-bar-item'}>
              <Searchbar />
          </div>
          <div className={'top-bar-item volume'}>
            <Volume />
          </div>
          <div className={'top-bar-item settings'}>
              <button className={'settings-button'}>
                  <span className={'material-icons'}>account_circle</span>
              </button>
              <button className={'settings-button'}>
                  <span className={'material-icons'}>notifications</span>
              </button>
          </div>
      </div>
  );
}

export default Topbar;
