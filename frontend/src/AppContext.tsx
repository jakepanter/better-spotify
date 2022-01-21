import React from "react";

export type ContextMenu = {
  type: String;
  isOpen: boolean;
  x: number | null;
  y: number | null;
  data: any;
};

interface IContextProps {
  contextMenu: ContextMenu;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenu>>;
}

const AppContext = React.createContext({} as IContextProps);

export default AppContext;
