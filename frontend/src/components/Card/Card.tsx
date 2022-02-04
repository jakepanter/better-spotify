/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import CoverPlaceholder from "../CoverPlaceholder/CoverPlaceholder";
import "./Card.scss";

type Props = {
  item: any;
  linkTo: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  subsubtitle?: string;
  handleRightClick: (e: any, clickedItem: any) => void;
  roundCover?: boolean;
};

export default function Card(props: Props) {
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
      {props.subtitle && <span className={"CardSubtitle"}>{props.subtitle}</span>}
      {props.subsubtitle && <span className={"CardSubsubtitle"}>{props.subsubtitle}</span>}
    </Link>
  );
}
