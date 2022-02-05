import React from "react";
import "./CoverPlaceholder.scss";
import img from "./placeholder.jpg";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function CoverPlaceholder(props: Props) {
  return (
    <div
      className={`CoverPlaceholder ${props.className}`}
      style={{ backgroundImage: `url(${img})` }}
    ></div>
  );
}

export default CoverPlaceholder;
