import React, { useContext, useRef, useState } from "react";
import { SinglePlaylistResponse } from "spotify-types";
import "./ContextMenu.scss";
import { API_URL } from "../../utils/constants";
import AppContext from "../../AppContext";
import useOutsideClick from "../../helpers/useOutsideClick";
import { getAuthHeader } from "../../helpers/api-helpers";
import { useHistory } from "react-router-dom";
import Dialog from "../Dialog/Dialog";

import { useDropzone } from "react-dropzone";
import { compressAccurately, EImageType } from "image-conversion";

type Props = {
  data: SinglePlaylistResponse;
  anchorPoint: { x: number; y: number };
};

function EditPlaylistDialog(props: Props) {
  const authHeader = getAuthHeader();
  const [title, setTitle] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description ?? "");
  const [image, setImage] = useState<string | ArrayBuffer | null>(props.data.images[0].url ?? "");

  const state = useContext(AppContext);
  const history = useHistory();

  const reader = new FileReader();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    maxSize: 5000000,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDropRejected: () => {
      console.log("THIS FILE IS TOO LARGE! MAX SIZE 5MB");
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      else compressImage(acceptedFiles[0]);
    },
  });

  const compressImage = (file: File) => {
    // compresses the image to around 180kB, Spotify API accepts 200kB max
    compressAccurately(file, {
      size: 180,
      accuracy: 0.99,
      type: EImageType.JPEG,
    }).then((compressedImage) => {
      reader.addEventListener("load", () => setImage(reader.result), false);
      reader.readAsDataURL(compressedImage);
    });
  };

  const ref = useRef();
  useOutsideClick(ref, () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  });

  const closeMenu = () => {
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
  };

  const saveChanges = async () => {
    // update title and description
    fetch(`${API_URL}api/spotify/playlist/${props.data.id}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ name: title, description: description }),
    });
    // update cover image if changed
    if (image !== props.data.images[0].url) {
      const img = (image as string).split("base64,")[1];
      await fetch(`${API_URL}api/spotify/playlist/${props.data.id}/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ image: img }),
      });
    }
    state.setContextMenu({ ...state.contextMenu, isOpen: false });
    history.push(history.location.pathname, { edited: props.data.id });
  };

  return (
    <Dialog
      title={`Edit Playlist "${props.data.name}"`}
      open={state.contextMenu.isOpen}
      onClose={closeMenu}
    >
      <p>Cover</p>
      <div {...getRootProps({ className: "dropzone cover-wrapper" })} onClick={open}>
        <input {...getInputProps()} />
        <div className="hover-overlay">
          <span className="material-icons">upload</span>
          <span>Drag &amp; drop or click to select an image to upload</span>
        </div>
        <img width={200} src={image?.toString()} alt={props.data.name + " Cover"} />
      </div>

      <p>Title</p>
      <h3>
        <input
          type="text"
          minLength={50}
          maxLength={50}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </h3>

      <p>Description</p>
      <textarea
        minLength={1}
        maxLength={200}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button className={"button"} onClick={saveChanges} disabled={!title.trim()}>
        Save
      </button>
    </Dialog>
  );
}

export default EditPlaylistDialog;
