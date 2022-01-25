import "./TrackList.scss";
import React, { useContext, useEffect, useState, useRef } from "react";
import { EpisodeObjectFull, PlaylistObjectFull, SavedTrackObject, TrackObjectFull } from "spotify-types";
import { AlbumTrack } from "../Album/Album";
import { PlaylistTrack } from "../Playlist/Playlist";
import TrackListItem from "../TrackListItem/TrackListItem";
import AppContext from "../../AppContext";
import TagsSystem from "../../utils/tags-system";
import { ShowEpisodes } from "../Show/Show";
import {TagsTrack} from "../TagTracklist/TagTracklist";
import { SongHistoryTrack } from "../SongHistory/SongHistory";

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
      playlist: PlaylistObjectFull;
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
      type: "show";
      tracks: ShowEpisodes[];
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
    }
  | {
      type: "songhistory";
      tracks: SongHistoryTrack[];
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
      if (props.type === "playlist" && state.contextMenu.data.tracks) {
        if (selectedTracks[0] !== state.contextMenu.data.tracks[0]) {
          state.setContextMenu({
            ...state.contextMenu,
            type: `tracklist-${props.type}`,
            isOpen: false,
            data: { tracks: selectedTracks, playlist: props.playlist },
          });
        }
      } else {
        if (selectedTracks[0] !== state.contextMenu.data[0]) {
          state.setContextMenu({
            ...state.contextMenu,
            type: `tracklist-${props.type}`,
            isOpen: false,
            data: selectedTracks,
          });
        }
      }
    } else {
      state.setContextMenu({
        ...state.contextMenu,
        type: `tracklist-${props.type}`,
        isOpen: false,
        data:
          props.type === "playlist"
            ? { tracks: selectedTracks, playlist: props.playlist }
            : selectedTracks,
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
        type: `tracklist-${props.type}`,
        isOpen: true,
        x: x,
        y: y,
        data:
          props.type === "playlist"
            ? { tracks: [trackUniqueId], playlist: props.playlist }
            : [trackUniqueId],
      });
      setSelected([trackUniqueId]);
    } else {
      state.setContextMenu({
        type: `tracklist-${props.type}`,
        isOpen: true,
        x: x,
        y: y,
        data:
          props.type === "playlist"
            ? { tracks: selectedTracks, playlist: props.playlist }
            : selectedTracks,
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

  const isTrackSelected = (track: TrackObjectFull | AlbumTrack | EpisodeObjectFull, index: number) => {
    const trackUniqueId = `${track.uri}-${index}`;
    return selectedTracks.some((track) => track === trackUniqueId);
  };

  // Tags
  const tags = TagsSystem.getTags();

  // Hiding tracklist information
  const container = useRef<HTMLDivElement>(null);
  let sizeClass = "TracklistSmall";
  const width = container?.current?.clientWidth ?? 0;
  if (width > 1000) {
    sizeClass = "TracklistLarge";
  } else if (width > 512) {
    sizeClass = "TracklistMedium";
  }

  return (
    <>
      {type === "album" && (
        <div
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
          ref={container}
        >
          <div className={"TableHeader TableRow"}>
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
                TagsSystem.getTagsOfElement(track.id).map((id) => ({
                  id,
                  ...tags.availableTags[id],
                })) ?? [];
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
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
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
            <div className={"TableCell TableCellActions"}></div>
          </div>
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const { track } = item;
              const tagList =
                TagsSystem.getTagsOfElement(track.id).map((id) => ({
                  id,
                  ...tags.availableTags[id],
                })) ?? [];
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
              const tagList =
                TagsSystem.getTagsOfElement(item.id).map((id) => ({
                  id,
                  ...tags.availableTags[id],
                })) ?? [];
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
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
          ref={container}
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
                TagsSystem.getTagsOfElement(track.id).map((id) => ({
                  id,
                  ...tags.availableTags[id],
                })) ?? [];
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

      {type === "show" && (
        <div
          className={"Tracklist"}
          onScroll={(e: React.UIEvent<HTMLDivElement>) =>
            scrollHandler(e, loadMoreCallback)
          }
        >
          <div className={"TableBody"}>
            {props.tracks.map((item, index) => {
              const episode = item ;
              const tagList = TagsSystem.getTagsOfElement(episode.id).map((id) => ({id, ...tags.availableTags[id]})) ?? [];
              return (
                <TrackListItem
                  track={episode}
                  name={episode.name}
                  duration_ms={episode.duration_ms}
                  image={episode.images[0]}
                  description={episode.description}
                  liked={episode.is_saved}
                  key={type + "-episode-" + episode.id + "-" + index}
                  listIndex={index}
                  selected={isTrackSelected(episode, index)}
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

      {type === "tags" && (
        <div
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
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
              const tagList =
                TagsSystem.getTagsOfElement(track.id)
                  .filter((t) => t !== props.hideTag)
                  .map((id) => ({ id, ...tags.availableTags[id] })) ?? [];
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

      {type === "songhistory" && (
        <div
          className={`Tracklist ${sizeClass}`}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}
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
            {props.tracks.map((item, index) => {
              const track = item.track as TrackObjectFull;
              const tagList =
                TagsSystem.getTagsOfElement(track.id).map((id) => ({
                  id,
                  ...tags.availableTags[id],
                })) ?? [];
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
                  id_tracklist={""}
                  type={type}
                  liked={item.is_saved}
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
