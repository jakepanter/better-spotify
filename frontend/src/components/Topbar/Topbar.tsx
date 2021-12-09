import React from "react";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";

const Topbar = () => {
  return (
      <div className={'top-bar'}>
          <div className={'top-bar-item'}>
              <Searchbar />
          </div>
          <div className={'top-bar-item volume-slider'}>Lautstärke</div>
          <div className={'top-bar-item settings'}>
              <button>
                  <span className={'material-icons'}>notifications</span>
              </button>
              <button>
                  <span className={'material-icons'}>account_circle</span>
              </button>
          </div>
      </div>
  );
}

export default Topbar;
