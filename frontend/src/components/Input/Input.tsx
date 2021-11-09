import React, {BaseSyntheticEvent, Component} from 'react';
import './Input.scss';

interface IProps {
  type: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'search';
  label?: string;
  value?: string | number;
  min?: number;
  max?: number;
}

interface IState {
  value: string | number;
}

class Input extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: (this.props.value) ? this.props.value : ((this.props.type === 'number') ? 0 : ''),
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(e: BaseSyntheticEvent) {
    let value = e.target.value;

    if (this.props.type === 'number') {
      value = (value === '') ? null : Number(value);
    }

    this.setState(() => ({value: value}));
  }

  render() {
    const className = `Input Input-${this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} ${this.props.value === ''}`;

    return (
      <input
        className={className}
        type={this.props.type}
        title={this.props.label}
        onChange={this.onChange}
        value={this.props.value}
        min={this.props.min}
        max={this.props.max}
      />
    );
  }
}

export default Input;
