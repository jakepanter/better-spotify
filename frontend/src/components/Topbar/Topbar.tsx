import React from "react";
import "./Topbar.scss";
import Searchbar from "../Searchbar/Searchbar";
import 'rc-slider/assets/index.css';
import Volume from "./Volume";
import {API_URL} from "../../utils/constants";

function authorize() {
    fetch(`${API_URL}api/spotify/get-auth-url`)
        .then((res) => res.text())
        .then((url) => {
            console.log(url);
            window.location.href = url;
        });
}

interface IProps {
    onChangeEditable: () => void,
    editable: boolean
}

const Topbar = (props: IProps) => {
    const toggleEditable = () => {
        props.onChangeEditable();
    }

  return (
      <div className={'top-bar'}>
          <div className={'top-bar-item search'}>
              <Searchbar />
          </div>
          <div className={'top-bar-item volume'}>
            <Volume />
          </div>
          <div className={'top-bar-item settings'}>
              <button className={'settings-button'} onClick={toggleEditable}>
                  <span className={'material-icons'}>{props.editable ? "close" : "edit"}</span>
              </button>
              <button className={'settings-button'} onClick={authorize}>
                  <span className={'material-icons'}>login</span>
              </button>
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
