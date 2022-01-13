import "./TrackList.scss";
import { SavedTrackObject, TrackObjectFull } from "spotify-types";
import { AlbumTrack } from "../Album/Album";
import { PlaylistTrack } from "../Playlist/Playlist";
import TrackContextMenuWrapper from "../TrackContextMenu/TrackContextMenuWrapper";
import React, {useEffect, useRef, useState} from "react";
import TrackListItem from "../TrackListItem/TrackListItem";
import TagsSystem from "../../utils/tags-system";
import {TagsTrack} from "../TagTracklist/TagTracklist";

type Props = {
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
      type: "tags";
      tracks: TagsTrack[];
      loadMoreCallback: () => void;
      fullyLoaded: boolean;
      id_tracklist: string;
      hideTag: string;
    }
  | {
    type: "search";
    tracks: TrackObjectFull[];
    loadMoreCallback: () => void;
    fullyLoaded: boolean;
    id_tracklist: string;
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
  const { type, loadMoreCallback, fullyLoaded, id_tracklist } = props;
  // stores currently selected track uris with their list index: (uri-listIndex, e.g spotify:track:HJG6FHmf7HG-3)
  // selectedTracks must have unique IDs to avoid weird behaviour when the same song is in a playlist multiple times
  const [selectedTracks, setSelected] = useState<String[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuType>({
    show: false,
    x: null,
    y: null,
    clickedTrackUri: "",
  });

  useEffect(() => {
    // close context menu when a new track is selected
    if (
      selectedTracks.length === 0 ||
      (selectedTracks.length === 1 &&
        selectedTracks[0] !== contextMenu.clickedTrackUri)
    ) {
      setContextMenu({ show: false, x: null, y: null, clickedTrackUri: "" });
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

  const handleContextMenuOpen = (
    trackUniqueId: String,
    x: number,
    y: number
  ) => {
    setContextMenu({
      show: true,
      x: x,
      y: y,
      clickedTrackUri: trackUniqueId,
    });
    if (!selectedTracks.some((track) => track === trackUniqueId))
      setSelected([trackUniqueId]);
  };

  const handleContextMenuClose = () => {
    setContextMenu({ ...contextMenu, show: false });
  };

  const addSelected = (trackUniqueId: String) => {
    setSelected([...selectedTracks, trackUniqueId]);
  };
  const removeSelected = (trackUniqueId: String) => {
    const arr: String[] = selectedTracks.filter(
      (track) => track !== trackUniqueId
    );
    setSelected(arr);
  };
  /*
  const resetSelected = () => {
    setSelected([]);
  };
  */

  const isTrackSelected = (
    track: TrackObjectFull | AlbumTrack,
    index: number
  ) => {
    const trackUniqueId = `${track.uri}-${index}`;
    return selectedTracks.some((track) => track === trackUniqueId);
  };

  // Tags
  const tags = TagsSystem.getTags();

  // Hiding tracklist information
  const container = useRef<HTMLDivElement>(null);
  let sizeClass = 'TracklistSmall';
  const width = container?.current?.clientWidth ?? 0;
  if (width > 1000) {
    sizeClass = 'TracklistLarge';
  } else if (width > 512) {
    sizeClass = 'TracklistMedium';
  }

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
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
          ref={container}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const track = item;
              const tagList = TagsSystem.getTagsOfElement(track.id).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
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
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
          ref={container}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              const tagList = TagsSystem.getTagsOfElement(track.id).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
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

      {
        type === "search" && (
          <div className={`Tracklist ${sizeClass}`} ref={container}>
            <div className={"TableHeader TableRow"}>
              <div className={"TableCell TableCellArtwork"} />
              <div className={"TableCell TableCellTitleArtist"}>Title</div>
              <div className={"TableCell TableCellAlbum"}>Album</div>
              <div className={"TableCell TableCellDuration"}>Duration</div>
              <div className={"TableCell TableCellTags"}>Tags</div>
            </div>
            <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const tagList = TagsSystem.getTagsOfElement(item.id).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
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
                      id_tracklist={''}
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
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
          ref={container}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellAddedAt"}>Added</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              const tagList = TagsSystem.getTagsOfElement(track.id).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
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
                  id_tracklist={''}
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

      {type === "tags" && (
        <div
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
          ref={container}
        >
          <div className={"TableHeader TableRow"}>
            <div className={"TableCell TableCellArtwork"} />
            <div className={"TableCell TableCellTitleArtist"}>Title</div>
            <div className={"TableCell TableCellAlbum"}>Album</div>
            <div className={"TableCell TableCellDuration"}>Duration</div>
            <div className={"TableCell TableCellLiked"}>Liked</div>
            <div className={"TableCell TableCellTags"}>Tags</div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((track, index) => {
              const tagList = TagsSystem.getTagsOfElement(track.id).filter((t) => t !== props.hideTag).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
              return (
                <TrackListItem
                  track={track}
                  name={track.name}
                  artists={track.artists}
                  duration_ms={track.duration_ms}
                  album={track.album}
                  key={type + "-track-" + track.id + "-" + index}
                  listIndex={index}
                  selected={isTrackSelected(track, index)}
                  onSelectionChange={handleSelectionChange}
                  onContextMenuOpen={handleContextMenuOpen}
                  id_tracklist={id_tracklist}
                  type={type}
                  liked={track.is_saved}
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
