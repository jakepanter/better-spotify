import React from "react";
import TrackListItem from "../TrackListItem/TrackListItem";
import './TrackList.scss';
import { AlbumObjectFull, PlaylistObjectFull, SavedTrackObject } from "spotify-types";

type Props = {
  type: 'album',
  id_tracklist: String,
  data: AlbumObjectFull,
} | {
  type: 'playlist',
  id_tracklist: String,
  data: PlaylistObjectFull,
} |
{
  type: 'saved',
  id_tracklist: String,
  data: SavedTrackObject[],
}

function TrackList(props: Props) {
    const { type } = props;
    const { id_tracklist } = props;
    //Hier koennen Unterschiedliche angelegt werden. Dabei muss aber auch TrackListItem angepasst werden!

    //ALBUM TRACKLIST
    if(type==="album") {
      const album = props.data;

      return(
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

                {album?.tracks.items.map((item, index) => {
                    return <TrackListItem id_track={item.id} offset={index} id_tracklist={id_tracklist} key={item.id} type={type}/>;
                })}

            </table>
          </div>
        </>
      )
    }

    //PLAYLIST TRACKLIST
    else if(type === "playlist") {
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
                  {playlist?.tracks.items.map((item, index) => {
                      return <TrackListItem id_track={item.track.id} id_tracklist={id_tracklist} offset={index} key={item.track.id} type={type}/>;
                  })}
              </table>
            </div>
          </>
      );
    }

    //SAVED TRACKS TRACKLIST
    else if(type === "saved") {
      const saved = props.data;
        
      return(
        <>
          {saved.map((item, index) => {
              return <TrackListItem id_track={item.track.id} id_tracklist={id_tracklist} offset={index} key={item.track.id} type={type}/>
          })}    
        </>
      )
    }
    else{
        return(
            <>
            </>
        )
    }
}



 export default TrackList;