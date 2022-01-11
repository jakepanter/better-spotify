import "./TrackList.scss";
import React, { useContext, useEffect, useState } from "react";
import { SavedTrackObject, TrackObjectFull } from "spotify-types";
import { AlbumTrack } from "../Album/Album";
import { PlaylistTrack } from "../Playlist/Playlist";
import TrackListItem from "../TrackListItem/TrackListItem";
import AppContext from "../../AppContext";
import TagsSystem from "../../utils/tags-system";

type Props =
  | {
      type: "album";
      tracks: AlbumTrack[];
      loadMoreCallback: () => void;
      fullyLoaded: boolean;
      id_tracklist: string;
    }
  | {
      type: "playlist";
      tracks: PlaylistTrack[];
      loadMoreCallback: () => void;
      fullyLoaded: boolean;
      id_tracklist: string;
    }
  | {
      type: "saved";
      tracks: SavedTrackObject[];
      loadMoreCallback: () => void;
      fullyLoaded: boolean;
      id_tracklist: string;
    }
  | {
      type: "search";
      tracks: TrackObjectFull[];
      loadMoreCallback: () => void;
      fullyLoaded: boolean;
      id_tracklist: string;
    };

function scrollHandler(e: React.UIEvent<HTMLDivElement>, loadMoreCallback: () => void) {
  if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
    loadMoreCallback();
  }
}

function TrackList(props: Props) {
  const { type, loadMoreCallback, fullyLoaded, id_tracklist } = props;
  // stores currently selected track uris with their list index: (uri-listIndex, e.g spotify:track:HJG6FHmf7HG-3)
  // selectedTracks must have unique IDs to avoid weird behaviour when the same song is in a playlist multiple times
  const [selectedTracks, setSelected] = useState<String[]>([]);
  const state = useContext(AppContext);

  useEffect(() => {
    if (selectedTracks.length === 0)
      state.setContextMenu({ ...state.contextMenu, isOpen: false, data: [], x: null, y: null });
    else if (selectedTracks.length === 1) {
      if (selectedTracks[0] !== state.contextMenu.data[0]) {
        state.setContextMenu({
          ...state.contextMenu,
          type: "tracks",
          isOpen: false,
          data: selectedTracks,
        });
      }
    } else {
      state.setContextMenu({
        ...state.contextMenu,
        type: "tracks",
        isOpen: false,
        data: selectedTracks,
      });
    }
  }, [selectedTracks]);

  const handleSelectionChange = (
    trackUniqueId: String,
    selected: boolean,
    specialKey: String | null
  ) => {
    if (selected) {
      if (!specialKey) setSelected([trackUniqueId]);
      if (specialKey === "shift") addSelected(trackUniqueId);
    } else removeSelected(trackUniqueId);
  };

  const handleContextMenuOpen = (trackUniqueId: String, x: number, y: number) => {
    if (!selectedTracks.some((track) => track === trackUniqueId)) {
      state.setContextMenu({
        ...state.contextMenu,
        type: "tracks",
        isOpen: true,
        x: x,
        y: y,
        data: [trackUniqueId],
      });
      setSelected([trackUniqueId]);
    } else {
      state.setContextMenu({
        ...state.contextMenu,
        type: "tracks",
        isOpen: true,
        x: x,
        y: y,
        data: selectedTracks,
      });
    }
  };

  const addSelected = (trackUniqueId: String) => {
    setSelected([...selectedTracks, trackUniqueId]);
  };
  const removeSelected = (trackUniqueId: String) => {
    const arr: String[] = selectedTracks.filter((track) => track !== trackUniqueId);
    setSelected(arr);
  };
  /*
  const resetSelected = () => {
    setSelected([]);
  };
  */

  const isTrackSelected = (track: TrackObjectFull | AlbumTrack, index: number) => {
    const trackUniqueId = `${track.uri}-${index}`;
    return selectedTracks.some((track) => track === trackUniqueId);
  };

  // Tags
  const tags = TagsSystem.getTags();

  return (
    <>
      {type === "album" && (
        <div
          className={"Tracklist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
            <div className={"TableCell TableCellActions"}></div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const track = item;
              const tagList =
                tags.spotifyElements[track.id]?.map((id) => tags.availableTags[id]) ?? [];
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  liked={track.is_saved}
                  key={type + "-track-" + track.id + "-" + index}
                  listIndex={index}
                  selected={isTrackSelected(track, index)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                  id_tracklist={id_tracklist}
                  type={type}
                  tags={tagList}
                />
              );
            })}
            {!fullyLoaded ? (
              <div className={"PlaylistLoader"}>
                <div className={"loader"} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      {type === "playlist" && (
        <div
          className={"Tracklist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
            <div className={"TableCell TableCellActions"}></div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              const tagList =
                tags.spotifyElements[track.id]?.map((id) => tags.availableTags[id]) ?? [];
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
                  listIndex={index}
                  selected={isTrackSelected(track, index)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                  id_tracklist={id_tracklist}
                  type={type}
                  tags={tagList}
                />
              );
            })}
            {!fullyLoaded ? (
              <div className={"PlaylistLoader"}>
                <div className={"loader"} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      {type === "search" && (
        <div className={"Tracklist"}>
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const tagList =
                tags.spotifyElements[item.id]?.map((id) => tags.availableTags[id]) ?? [];
              return (
                <div key="TrackList">
                  <TrackListItem
                    track={item}
                    name={item.name}
                    artists={item.artists}
                    duration_ms={item.duration_ms}
                    album={item.album}
                    key={type + "-track-" + item.id + "-" + index}
                    listIndex={index}
                    selected={isTrackSelected(item, index)}
                    onSelectionChange={handleSelectionChange}
                    onContextMenuOpen={handleContextMenuOpen}
                    id_tracklist={""}
                    type={type}
                    tags={tagList}
                  />
                </div>
              );
            })}
            {!fullyLoaded ? (
              <div className={"PlaylistLoader"}>
                <div className={"loader"} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      {type === "saved" && (
        <div
          className={"Tracklist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
            <div className={"TableCell TableCellActions"}></div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              const tagList =
                tags.spotifyElements[track.id]?.map((id) => tags.availableTags[id]) ?? [];
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  album={track.album}
                  added_at={item.added_at}
                  key={type + "-track-" + track.id + "-" + index}
                  listIndex={index}
                  selected={isTrackSelected(track, index)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                  id_tracklist={""}
                  type={type}
                  tags={tagList}
                />
              );
            })}
            {!fullyLoaded ? (
              <div className={"PlaylistLoader"}>
                <div className={"loader"} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TrackList;
