import React, {Component} from 'react';

interface IProps {
  label?: string;
  icon?: string;
  style?: string;
  children?: any;
  onClick?: () => void;
}

interface IState {}

class Button extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const className = `button ${this.props.icon ? 'has-icon' : ''} ${this.props.label ? 'has-label' : ''}`;

    return (<button className={className} title={this.props.label} onClick={this.props.onClick}>
      {this.props.icon ? <span className={'material-icons'}>{this.props.icon}</span> : ''}
      {this.props.children ? this.props.children : this.props.label}
    </button>);
  }
}

export default Button;
