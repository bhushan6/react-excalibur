import React from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" &&
  (window.document?.createElement ||
    window.navigator?.product === "ReactNative")
    ? React.useLayoutEffect
    : React.useEffect;

export const ExcaliburContext = React.createContext(null);

export function useStore() {
  const store = React.useContext(ExcaliburContext);
  if (!store)
    throw Error(
      `react-excalibur hooks can only used inside a canvas or ExcaliburContext provider!`
    );
  return store;
}

export function useExcalibur(selector, equalityFn) {
  return useStore()(selector, equalityFn);
}
