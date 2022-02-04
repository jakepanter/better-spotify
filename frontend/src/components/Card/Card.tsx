/* eslint-disable no-unused-vars */
import React from "react";
import {Link, useHistory} from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Card.scss";
import {ArtistObjectSimplified} from "spotify-types";

type Props = {
  item: any;
  linkTo: string;
  imageUrl: string;
  title: string;
  subtitle?: string | ArtistObjectSimplified[];
  subsubtitle?: string;
  handleRightClick: (e: any, clickedItem: any) => void;
  roundCover?: boolean;
};

export default function Card(props: Props) {
  const history = useHistory();

  const goToArtist = (e: any, artistId: string) => {
    e.preventDefault();
    history.push(`/artist/${artistId}`)
  };

  return (
    <Link
      to={props.linkTo}
      className={"Card"}
      onContextMenu={(e) => props.handleRightClick(e, props.item)}
    >
      {props.imageUrl !== "" ? (
        <div
          className={`CardCover ${props.roundCover ? "Rounded" : ""}`}
          style={{ backgroundImage: `url(${props.imageUrl}` }}
        />
      ) : (
        <CoverPlaceholder className={props.roundCover ? "Rounded" : ""} />
      )}
      <span className={"CardTitle"}>{props.title}</span>
      {props.subtitle && (typeof props.subtitle === "string") && <span className={"CardSubtitle"}>{props.subtitle}</span>}
      {props.subtitle && (typeof props.subtitle !== "string") && <span className={"CardSubtitle"}>{props.subtitle.map<React.ReactNode>((a) => <span onClick={e => goToArtist(e, a.id)} key={a.id}>{a.name}</span>).reduce((a,b)=>[a,', ',b])}</span>}
      {props.subsubtitle && <span className={"CardSubsubtitle"}>{props.subsubtitle}</span>}
    </Link>
  );
}
