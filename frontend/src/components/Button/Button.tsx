import React, { Component } from "react";
import "./Button.scss";

interface IProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label?: string;
  icon?: string;
  simple?: boolean;
}

interface IState {}

class Button extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const className = `Button ${this.props.icon ? "has-icon" : ""} ${
      this.props.label ? "has-label" : ""
    } ${this.props.simple ? "simple" : "button"}`;

    return (
      <button
        className={className}
        title={this.props.label}
        onClick={this.props.onClick}
      >
        {this.props.icon ? (
          <span className={"material-icons"}>{this.props.icon}</span>
        ) : (
          ""
        )}
        {this.props.children ? this.props.children : this.props.label}
      </button>
    );
  }
}

export default Button;
