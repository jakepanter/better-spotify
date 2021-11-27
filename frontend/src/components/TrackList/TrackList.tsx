/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import TrackListItem from "../TrackListItem/TrackListItem";
import "./TrackList.scss";
import {
  AlbumObjectFull,
  PlaylistObjectFull,
  SavedTrackObject,
} from "spotify-types";

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

function TrackList(props: Props) {
  const { type } = props;
  const [selectedTracks, setSelected] = useState<String[]>([]);
  //Hier koennen Unterschiedliche angelegt werden. Dabei muss aber auch TrackListItem angepasst werden!

  useEffect(() => {
    console.log(selectedTracks);
    //idk do something
  }, [selectedTracks]);

  const handleSelectionChange = (
    track: String,
    selected: boolean,
    specialKey: String
  ) => {
    if (selected) {
      if (specialKey === "") setSelected([track]);
      if (specialKey === "shift") addSelected(track);
      // if (specialKey === "shift") addSelected(track);
    } else removeSelected(track);
  };

  const addSelected = (trackId: String) => {
    setSelected([...selectedTracks, trackId]);
  };
  const removeSelected = (trackId: String) => {
    const arr: String[] = selectedTracks.filter((track) => track !== trackId);
    setSelected(arr);
  };
  const resetSelected = () => {
    setSelected([]);
  };

  //ALBUM TRACKLIST
  if (type === "album") {
    const album = props.data;

    return (
      <>
        <div className={"Playlist"}>
          <h2>{album.name}</h2>
          <h3>{album.artists.map((artist) => artist.name).join(", ")}</h3>
          <table>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artists</th>
              <th>Duration</th>
            </tr>

            {album?.tracks.items.map((item, i) => {
              return (
                <TrackListItem
                  list_index={i}
                  id_track={item.id}
                  key={item.id}
                  type={type}
                  selected={selectedTracks.some((track) => track === item.id)}
                  onSelectionChange={handleSelectionChange}
                />
              );
            })}
          </table>
        </div>
      </>
    );
  }

  //PLAYLIST TRACKLIST
  else if (type === "playlist") {
    const playlist = props.data;

    return (
      <>
        <div className={"Playlist"}>
          <h2>{playlist.name}</h2>
          <table>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artists</th>
              <th>Duration</th>
            </tr>
            {playlist?.tracks.items.map((item, i) => {
              return (
                <TrackListItem
                  list_index={i}
                  id_track={item.track.id}
                  key={item.track.id}
                  type={type}
                  selected={selectedTracks.some(
                    (track) => track === item.track.id
                  )}
                  onSelectionChange={handleSelectionChange}
                />
              );
            })}
          </table>
        </div>
      </>
    );
  }

  //SAVED TRACKS TRACKLIST
  else if (type === "saved") {
    const saved = props.data;
    return (
      <>
        {saved.map((item, i) => {
          return (
            <TrackListItem
              list_index={i}
              id_track={item.track.id}
              key={item.track.id}
              type={type}
              selected={selectedTracks.some((track) => track === item.track.id)}
              onSelectionChange={handleSelectionChange}
            />
          );
        })}
      </>
    );
  } else {
    return <p>unsupported tracklist type</p>;
  }
}

export default TrackList;
