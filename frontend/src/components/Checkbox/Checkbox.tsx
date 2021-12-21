import React, {ChangeEvent, Component} from "react";
import './Checkbox.scss';

interface IProps {
  checked?: boolean;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
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
      console.log('defined');
      this.state = { checked: props.checked };
    } else {
      console.log('undefined');
      this.state = { checked: false };
    }
  }

  onChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState((state) => ({...state, checked: e.target.checked}));
    if (this.props.onChange !== undefined) {
      this.props.onChange(e);
    }
  }

  onClick(e: any) {
    if (this.props.onClick !== undefined) {
      e.preventDefault();
      this.props.onClick(e);
    }
  }

  render() {
    const { label, iconCodeChecked, iconCodeUnchecked } = this.props;
    const { checked } = this.state;

    return (
      <label className={`Checkbox ${checked ? 'checked' : ''}`}>
        <input className={'CheckboxElement'}
               type={'checkbox'}
               onChange={(e) => this.onChange(e)}
               onClick={(e) => this.onClick(e)}
        />
        <span className={'CheckboxIcon material-icons'}>
          {checked ? iconCodeChecked ? iconCodeChecked : 'check_box' : iconCodeUnchecked ? iconCodeUnchecked : 'check_box_outline_blank'}
        </span>
        <span className={'CheckboxLabel'}>{label}</span>
      </label>
    );
  }
}

export default Checkbox;
