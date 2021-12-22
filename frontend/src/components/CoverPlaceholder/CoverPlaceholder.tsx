import React from "react";
import "./CoverPlaceholder.scss";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function CoverPlaceholder(props: Props) {
  return <div className={`CoverPlaceholder ${props.className}`}></div>;
}

export default CoverPlaceholder;
