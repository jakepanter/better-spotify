/* eslint-disable no-unused-vars */
import React, { useContext, useRef, useState } from "react";
import {
  CurrentUsersProfileResponse,
  ListOfUsersPlaylistsResponse,
  SinglePlaylistResponse,
} from "spotify-types";
import useSWR from "swr";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { getAuthHeader } from "../../helpers/api-helpers";
import { useHistory } from "react-router-dom";
import Dialog from "../Dialog/Dialog";

type Props = {
  data: SinglePlaylistResponse;
  anchorPoint: { x: number; y: number };
};

function EditPlaylistDialog(props: Props) {
  const authHeader = getAuthHeader();
  const fetcher = (url: any) =>
    fetch(url, {
      headers: { Authorization: authHeader },
    }).then((r) => r.json());

  const [title, setTitle] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description ?? "");

  const state = useContext(AppContext);
  const history = useHistory();

  const { data: playlists, error: playlistsError } = useSWR<ListOfUsersPlaylistsResponse>(
    `${API_URL}api/spotify/playlists`,
    fetcher
  );

  const { data: me, error: meError } = useSWR<CurrentUsersProfileResponse>(
    `${API_URL}api/spotify/me`,
    fetcher
  );

  const ref = useRef();
  useOutsideClick(ref, () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  });

  const closeMenu = () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  };

  const changeTitle = (e: any) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const changeDescription = (e: any) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
  };

  const saveChanges = async () => {
    await fetch(`${API_URL}api/spotify/playlist/${props.data.id}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ name: title, description: description }),
    });
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    history.push(history.location.pathname, { edited: props.data.id });
  };

  if (playlistsError || meError) return <p>error</p>;

  return (
    <Dialog
      title={`Edit Playlist "${props.data.name}"`}
      open={state.contextMenu.isOpen}
      onClose={closeMenu}
    >
      <p>Title</p>
      <h3>
        <input
          id="playlist-title"
          type="text"
          maxLength={50}
          min={1}
          value={title}
          onChange={changeTitle}
        />
      </h3>

      <p>Description</p>
      <textarea
        id="playlist-description"
        maxLength={200}
        value={description}
        onChange={changeDescription}
      ></textarea>

      <button className={"button"} onClick={saveChanges} disabled={!title.trim()}>
        Save
      </button>
    </Dialog>
  );
}

export default EditPlaylistDialog;
