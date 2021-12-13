import React from "react";
import {AlbumObjectSimplified, ArtistObjectSimplified, TrackObjectFull, TrackObjectSimplified} from "spotify-types";
import {formatTimestamp} from "../../utils/functions";
//import SpotifyWebPlayer from "react-spotify-web-playback";

type Props = {
  track: TrackObjectFull | TrackObjectSimplified;
  name: string;
  artists: ArtistObjectSimplified[];
  duration_ms: number;
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
      <div className={'TableCell TableCellTitle'}>{track.name}</div>
      <div className={'TableCell TableCellArtist'}>{track.artists.map((artist) => artist.name).join(", ")}</div>
      <div className={'TableCell TableCellDuration'}>{formatTimestamp(track.duration_ms)}</div>
    </div>
  );
}

export default TrackListItem;
