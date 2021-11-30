import React from "react";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";

const Topbar = () => {
  return (
      <div className={'top-bar'}>
        <Searchbar />
      </div>
  );
}

export default Topbar;
