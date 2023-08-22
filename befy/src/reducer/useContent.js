import React, { createContext } from "react";
import useStore from "./useStore";
const Context = createContext({});
const Provider = ({ children }) => {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
export default Provider;
export {
  Context
}