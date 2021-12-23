import React from "react";
import TrackListItem from "../TrackListItem/TrackListItem";
import './TrackList.scss';
import {PlayHistoryObject, SavedTrackObject, TrackObjectFull} from "spotify-types";
import {AlbumTrack} from "../Album/Album";
import {PlaylistTrack} from "../Playlist/Playlist";

type Props = {
  type: 'album',
  tracks: AlbumTrack[];
  loadMoreCallback: () => void;
} | {
  type: 'playlist',
  tracks: PlaylistTrack[],
  loadMoreCallback: () => void;
} | {
  type: 'saved'
  tracks: SavedTrackObject[];
  loadMoreCallback: () => void;
} | {
  type: 'songhistory'
  tracks: PlayHistoryObject[];
  loadMoreCallback: () => void;
}

function scrollHandler(e: React.UIEvent<HTMLDivElement>, loadMoreCallback: () => void) {
  if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
    loadMoreCallback();
  }
}

function TrackList(props: Props) {
  const {type, loadMoreCallback} = props;
  //Hier koennen Unterschiedliche angelegt werden. Dabei muss aber auch TrackListItem angepasst werden!

  //ALBUM TRACKLIST
  if (type === "album") {
    const tracks = props.tracks;

    return (
      <div className={"Playlist"} onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}>
        <div className={'TableHeader TableRow'}>
          <div className={'TableCell TableCellArtwork'}/>
          <div className={'TableCell TableCellTitleArtist'}>Title</div>
          <div className={'TableCell TableCellDuration'}>Duration</div>
          <div className={'TableCell TableCellLiked'}>Liked</div>
        </div>
        <div className={'TableBody'}>
          {tracks.map((item) => {
            return <TrackListItem track={item}
                                  name={item.name}
                                  artists={item.artists}
                                  duration_ms={item.duration_ms}
                                  liked={item.is_saved}
                                  key={item.id}/>;
          })}
        </div>
      </div>
    )
  }

  //PLAYLIST TRACKLIST
  else if (type === "playlist") {
    const tracks = props.tracks;

    return (
      <div className={"Playlist"} onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}>
        <div className={'TableHeader TableRow'}>
          <div className={'TableCell TableCellArtwork'}/>
          <div className={'TableCell TableCellTitleArtist'}>Title</div>
          <div className={'TableCell TableCellAlbum'}>Album</div>
          <div className={'TableCell TableCellAddedAt'}>Added</div>
          <div className={'TableCell TableCellDuration'}>Duration</div>
          <div className={'TableCell TableCellLiked'}>Liked</div>
        </div>
        <div className={'TableBody'}>
          {tracks.map((item) => {
            const {track} = item;
            return <TrackListItem track={track}
                                  name={track.name}
                                  artists={track.artists}
                                  duration_ms={track.duration_ms}
                                  album={track.album}
                                  added_at={item.added_at}
                                  liked={item.is_saved}
                                  key={track.id} />;
          })}
        </div>
      </div>
    );
  }

  //SAVED TRACKS TRACKLIST
  else if (type === "saved") {
    const saved = props.tracks;

    return (
      <div className={"Playlist"} onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}>
        <div className={'TableHeader TableRow'}>
          <div className={'TableCell TableCellArtwork'}/>
          <div className={'TableCell TableCellTitleArtist'}>Title</div>
          <div className={'TableCell TableCellAlbum'}>Album</div>
          <div className={'TableCell TableCellAddedAt'}>Added</div>
          <div className={'TableCell TableCellDuration'}>Duration</div>
        </div>
        <div className={'TableBody'}>
          {saved.map((item) => {
            const {track} = item;
            return <TrackListItem track={track}
                                  name={track.name}
                                  artists={track.artists}
                                  duration_ms={track.duration_ms}
                                  album={track.album}
                                  added_at={item.added_at}
                                  key={track.id} />;
          })}
        </div>
      </div>
    )
  }
  else if(type==="songhistory"){
    const recentPlayedTracks = props.tracks;

    return (
        <div className={"Playlist"} onScroll={(e: React.UIEvent<HTMLDivElement>) => scrollHandler(e, loadMoreCallback)}>
          <div className={'TableHeader TableRow'}>
            <div className={'TableCell TableCellArtwork'}/>
            <div className={'TableCell TableCellTitleArtist'}>Title</div>
            <div className={'TableCell TableCellAlbum'}>Album</div>
            <div className={'TableCell TableCellDuration'}>Duration</div>
          </div>
          <div className={'TableBody'}>
            {recentPlayedTracks.map((item) => {
                const track = item.track as TrackObjectFull;
              return <TrackListItem track={track}
                                    name={track.name}
                                    artists={track.artists}
                                    duration_ms={track.duration_ms}
                                    album={track.album}
                                    key={item.played_at} />;
            })}
          </div>
        </div>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}

export default TrackList;
