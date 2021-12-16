import React from "react";
import {AlbumObjectSimplified, ArtistObjectSimplified, TrackObjectFull, TrackObjectSimplified} from "spotify-types";
import {formatTimeDiff, formatTimestamp} from "../../utils/functions";
import Checkbox from "../Checkbox/Checkbox";
//import SpotifyWebPlayer from "react-spotify-web-playback";

type Props = {
  track: TrackObjectFull | TrackObjectSimplified;
  name: string;
  artists: ArtistObjectSimplified[];
  duration_ms: number;
  added_at?: string;
  liked?: boolean;
  album?: AlbumObjectSimplified;
};

function TrackListItem(props: Props) {
  const track = props;

  return (
    <div className={'TableRow'}>
      {track.album !== undefined ?
        <div className={'TableCell TableCellArtwork'}>
          <img style={{width: "40px", height: "40px"}} src={track.album.images[2].url} alt=""/>
        </div>
        :
        <></>
      }
      <div className={'TableCell TableCellTitleArtist'}>
        <span className={'TableCellTitle'}>{track.name}</span>
        <span className={'TableCellArtist'}>{track.artists.map((artist) => artist.name).join(", ")}</span>
      </div>
      {track.album !== undefined ?
        <div className={'TableCell TableCellAlbum'}>{track.album.name}</div>
        : <></>}
      {track.added_at !== undefined ? <div className={'TableCell TableCellAddedAt'}>
        {formatTimeDiff(new Date(track.added_at).getTime(), Date.now())}
      </div> : <></>}
      <div className={'TableCell TableCellDuration'}>{formatTimestamp(track.duration_ms)}</div>
      {track.liked !== undefined ? <div className={'TableCell TableCellLiked'}>
        <Checkbox checked={track.liked} iconCodeChecked={'favorite'} iconCodeUnchecked={'favorite_border'}/>
      </div> : <></>}
    </div>
  );
}

export default TrackListItem;
