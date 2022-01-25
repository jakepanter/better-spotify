import React from "react";
import "./Dialog.scss";

export interface IProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

function Dialog(props: React.PropsWithChildren<IProps>) {
  const { children, title, open, onClose } = props;

  return (
    <div className={`DialogWrapper ${open ? 'open' : ''}`}>
      <div className={'Dialog'}>
        <div className={'DialogHeader'}>
          <span className={'DialogHeaderTitle'}>{title}</span>
          <button className={'DialogHeaderCloseButton'} onClick={() => onClose()}>
            <span className={'material-icons'}>close</span>
          </button>
        </div>
        <div className={'DialogContent'}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
