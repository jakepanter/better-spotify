import "./TrackList.scss";
import { SavedTrackObject } from "spotify-types";
import { AlbumTrack } from "../Album/Album";
import { PlaylistTrack } from "../Playlist/Playlist";
import TrackContextMenuWrapper from "../TrackContextMenu/TrackContextMenuWrapper";
import React, { useEffect, useState } from "react";
import TrackListItem from "../TrackListItem/TrackListItem";

type Props =
  | {
      type: "album";
      tracks: AlbumTrack[];
      loadMoreCallback: () => void;
    }
  | {
      type: "playlist";
      tracks: PlaylistTrack[];
      loadMoreCallback: () => void;
    }
  | {
      type: "saved";
      tracks: SavedTrackObject[];
      loadMoreCallback: () => void;
    };

type ContextMenuType = {
  show: boolean;
  x: number | null;
  y: number | null;
  clickedTrackUri: String;
};

function scrollHandler(
  e: React.UIEvent<HTMLDivElement>,
  loadMoreCallback: () => void
) {
  if (
    e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
    e.currentTarget.scrollHeight
  ) {
    loadMoreCallback();
  }
}

function TrackList(props: Props) {
  const { type, loadMoreCallback } = props;
  //stores currently selected track uris
  const [selectedTracks, setSelected] = useState<String[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuType>({
    show: false,
    x: null,
    y: null,
    clickedTrackUri: "",
  });

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

  return (
    <>
      {contextMenu.show && contextMenu.x && contextMenu.y && (
        <TrackContextMenuWrapper
          tracks={selectedTracks}
          positionX={contextMenu.x}
          positionY={contextMenu.y}
          onClose={handleContextMenuClose}
        />
      )}

      {type === "album" && (
        <div
          className={"Playlist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const track = item;
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  liked={track.is_saved}
                  key={type + "-track-" + track.id + "-" + index}
                  selected={selectedTracks.some((t) => t === track.uri)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                />
              );
            })}
          </div>
        </div>
      )}

      {type === "playlist" && (
        <div
          className={"Playlist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  album={track.album}
                  added_at={item.added_at}
                  liked={item.is_saved}
                  key={type + "-track-" + track.id + "-" + index}
                  selected={selectedTracks.some((t) => t === track.uri)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                />
              );
            })}
          </div>
        </div>
      )}

      {type === "saved" && (
        <div
          className={"Playlist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  album={track.album}
                  added_at={item.added_at}
                  key={type + "-track-" + track.id + "-" + index}
                  selected={selectedTracks.some((t) => t === track.uri)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default TrackList;
