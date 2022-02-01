import React from "react";
import "./CoverPlaceholder.scss";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/* eslint-disable react/prop-types */
function CoverPlaceholder(props: Props) {
  return <div className={`CoverPlaceholder ${props.className}`} style={props.style}></div>;
}

export default CoverPlaceholder;
