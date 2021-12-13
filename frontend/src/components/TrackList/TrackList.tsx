import React, { useEffect, useState } from "react";
import TrackListItem from "../TrackListItem/TrackListItem";
import "./TrackList.scss";
import {
  AlbumObjectFull,
  PlaylistObjectFull,
  SavedTrackObject,
} from "spotify-types";
import TrackContextMenuWrapper from "../TrackContextMenu/TrackContextMenuWrapper";

type Props =
  | {
      type: "album";
      data: AlbumObjectFull;
    }
  | {
      type: "playlist";
      data: PlaylistObjectFull;
    }
  | {
      type: "saved";
      data: SavedTrackObject[];
    };

type ContextMenuType = {
  show: boolean;
  x: number | null;
  y: number | null;
  clickedTrackUri: String;
};

function TrackList(props: Props) {
  const { type } = props;
  //stores currently selected track uris
  const [selectedTracks, setSelected] = useState<String[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuType>({
    show: false,
    x: null,
    y: null,
    clickedTrackUri: "",
  });
  //Hier koennen Unterschiedliche angelegt werden. Dabei muss aber auch TrackListItem angepasst werden!

  useEffect(() => {
    // console.log(selectedTracks);
    //idk do something
    if (
      selectedTracks.length === 0 ||
      (selectedTracks.length === 1 &&
        selectedTracks[0] !== contextMenu.clickedTrackUri)
    ) {
      setContextMenu({ show: false, x: null, y: null, clickedTrackUri: "" });
    }
  }, [selectedTracks]);

  const handleSelectionChange = (
    track: String,
    selected: boolean,
    specialKey: String | null
  ) => {
    if (selected) {
      if (!specialKey) setSelected([track]);
      if (specialKey === "shift") addSelected(track);
    } else removeSelected(track);
  };

  const handleContextMenuOpen = (trackUri: String, x: number, y: number) => {
    setContextMenu({
      show: true,
      x: x,
      y: y,
      clickedTrackUri: trackUri,
    });
    if (!selectedTracks.some((track) => track === trackUri))
      setSelected([trackUri]);
  };

  const handleContextMenuClose = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  const addSelected = (trackUri: String) => {
    setSelected([...selectedTracks, trackUri]);
  };
  const removeSelected = (trackUri: String) => {
    const arr: String[] = selectedTracks.filter((track) => track !== trackUri);
    setSelected(arr);
  };
  /*
  const resetSelected = () => {
    setSelected([]);
  };
  */

  if (!props.data) return <p>loading tracklist...</p>;

  return (
    <>
      {contextMenu.show && (
        <TrackContextMenuWrapper
          tracks={selectedTracks}
          positionX={contextMenu.x!}
          positionY={contextMenu.y!}
          onClose={handleContextMenuClose}
        />
      )}

      {props.type === "album" && (
        <>
          <div className={"TrackList Album"}>
            <h2>{props.data.name}</h2>
            <h3>
              {props.data.artists.map((artist) => artist.name).join(", ")}
            </h3>
            <table>
              <thead className="table-header">
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Artists</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {props.data.tracks.items.map((item, i) => {
                  return (
                    <TrackListItem
                      list_index={i}
                      track_id={item.id}
                      track_uri={item.uri}
                      key={item.id}
                      type={type}
                      selected={selectedTracks.some(
                        (track) => track === item.uri
                      )}
                      onSelectionChange={handleSelectionChange}
                      onContextMenuOpen={handleContextMenuOpen}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {props.type === "playlist" && (
        <>
          <div className={"TrackList Playlist"}>
            <h2>{props.data.name}</h2>
            <table>
              <thead className="table-header">
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Artists</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {props.data.tracks.items.map((item, i) => {
                  return (
                    <TrackListItem
                      list_index={i}
                      track_id={item.track.id}
                      track_uri={item.track.uri}
                      key={item.track.id}
                      type={type}
                      selected={selectedTracks.some(
                        (track) => track === item.track.uri
                      )}
                      onSelectionChange={handleSelectionChange}
                      onContextMenuOpen={handleContextMenuOpen}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {props.type === "saved" && (
        <>
          <div className={"TrackList Saved"}>
            <table>
              <thead className="table-header">
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Artists</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {props.data.map((item, i) => {
                  return (
                    <TrackListItem
                      list_index={i}
                      track_id={item.track.id}
                      track_uri={item.track.uri}
                      key={item.track.id}
                      type={type}
                      selected={selectedTracks.some(
                        (track) => track === item.track.uri
                      )}
                      onSelectionChange={handleSelectionChange}
                      onContextMenuOpen={handleContextMenuOpen}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
export default TrackList;
