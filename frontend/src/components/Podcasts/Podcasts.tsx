import React from "react";
import LibraryAlbum from "./LibraryAlbums/LibraryAlbums";
//import { Link } from "react-router-dom";
//import { API_URL } from '../../utils/constants';
import "./Library.scss";

export default function Library() {

    return (
        <article className="c-card">
            <div className="c-card__body">
            <h2 className="c-card__title">
                Card
            </h2>   
            </div>
            <LibraryAlbum/>
        </article>
    );
}
