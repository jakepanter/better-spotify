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
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";

type Props = {
  data: SinglePlaylistResponse;
  anchorPoint: { x: number; y: number };
};

function EditPlaylistDialog(props: Props) {
  const authHeader = getAuthHeader();
  const [title, setTitle] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description ?? "");
  const [image, setImage] = useState<string | ArrayBuffer | null>(
    props.data.images[0] ? props.data.images[0].url : ""
  );
  const [error, setError] = useState("");

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
      setError("THIS FILE IS TOO LARGE! MAX SIZE 5MB");
    },
    onDrop: (acceptedFiles) => {
      setError("");
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
    // update title and description if changed
    let changes: any;
    if (title !== props.data.name && title !== "") changes.name = title;
    if (description !== props.data.description && description !== "")
      changes.description = description;
    if (changes) {
      await fetch(`${API_URL}api/spotify/playlist/${props.data.id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(changes),
      });
    }
    // update cover image if changed
    if (props.data.images[0] && image !== props.data.images[0].url) {
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
      <div className="dialog-wrapper">
        <div>
          <div {...getRootProps({ className: "dropzone cover-wrapper" })} onClick={open}>
            <input {...getInputProps()} />
            <div className="hover-overlay">
              <span className="material-icons">upload</span>
              <span>Drag &amp; drop or click to select an image to upload</span>
            </div>
            {image !== "" ? (
              <img width={200} src={image?.toString()} alt={props.data.name + " Cover"} />
            ) : (
              <CoverPlaceholder style={{ width: "200px", height: "200px" }} />
            )}
          </div>
          <p style={{ color: "darkgrey", fontSize: "12px" }}>Maximum image size is 5MB</p>
        </div>

        <div className="details">
          <p>Title</p>
          <h3>
            <input
              type="text"
              minLength={1}
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
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        className={"button"}
        onClick={saveChanges}
        disabled={!title.trim()}
        style={{ float: "right" }}
      >
        Save
      </button>
    </Dialog>
  );
}

export default EditPlaylistDialog;
