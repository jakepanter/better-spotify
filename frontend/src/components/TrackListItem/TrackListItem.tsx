import React from "react";
import {AlbumObjectSimplified, ArtistObjectSimplified, TrackObjectFull, TrackObjectSimplified} from "spotify-types";
import {formatTimestamp} from "../../utils/functions";
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
        <div className={'TableCell TableCellArtwork'} style={{width: "40px", height: "40px"}}/>
      }
      <div className={'TableCell TableCellTitleArtist'}>
        <span className={'TableCellTitle'}>{track.name}</span>
        <span className={'TableCellArtist'}>{track.artists.map((artist) => artist.name).join(", ")}</span>
      </div>
      {track.added_at ? <div className={'TableCell TableCellAddedAt'}>{track.added_at}</div> : <></>}
      <div className={'TableCell TableCellDuration'}>{formatTimestamp(track.duration_ms)}</div>
      {track.liked ? <div className={'TableCell TableCellLiked'}>
        {track.liked ? 'true' : 'false'}
      </div> : <></>}
    </div>
  );
}

export default TrackListItem;
