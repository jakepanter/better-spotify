import React, {Component} from "react";
import './Checkbox.scss';

interface IProps {
  checked?: boolean;
  label?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: boolean) => void | undefined;
  iconCodeChecked?: string;
  iconCodeUnchecked?: string;
}

interface IState {
  checked: boolean;
}

class Checkbox extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    if (props.checked !== undefined) {
      this.state = { checked: props.checked };
    } else {
      this.state = { checked: false };
    }
  }

  shouldComponentUpdate(nextProps: Readonly<IProps>) {
    if (nextProps.checked !== this.state.checked) {
      const value = nextProps.checked ?? true;
      this.setState({checked: value});
    }
    return true;
  }

  toggleState() {
    this.setState((oldState) => this.setState({checked: !oldState.checked}),
      () => {
      if (this.props.onChange !== undefined) {
        this.props.onChange(this.state.checked);
      }
    });
  }

  render() {
    const { label, iconCodeChecked, iconCodeUnchecked } = this.props;
    const { checked } = this.state;

    return (
      <button className={`Checkbox ${checked ? 'checked' : ''}`} onClick={() => this.toggleState()}>
        <span className={'CheckboxIcon material-icons'}>
          {checked ? iconCodeChecked ? iconCodeChecked : 'check_box' : iconCodeUnchecked ? iconCodeUnchecked : 'check_box_outline_blank'}
        </span>
        <span className={'CheckboxLabel'}>{label}</span>
      </button>
    );
  }
}

export default Checkbox;
