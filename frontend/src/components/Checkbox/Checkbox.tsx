import React, {ChangeEvent, Component} from "react";
import './Checkbox.scss';

interface IProps {
  checked?: boolean;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
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

  onChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState((state) => ({...state, checked: e.target.checked}));
    if (this.props.onChange !== undefined) {
      this.props.onChange(e);
    }
  }

  render() {
    const { label } = this.props;
    const { checked } = this.state;

    return (
      <label className={`Checkbox ${checked ? 'checked' : ''}`}>
        <input className={'CheckboxElement'} type={'checkbox'} checked={this.props.checked} onChange={(e) => this.onChange(e)} />
        <span className={'CheckboxIcon material-icons'}>{checked ? 'check_box' : 'check_box_outline_blank'}</span>
        <span className={'CheckboxLabel'}>{label}</span>
      </label>
    );
  }
}

export default Checkbox;
