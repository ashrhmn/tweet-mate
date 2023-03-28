import { DependencyList, useEffect } from "react";
import useTimeout from "./useTimeout";

const useDebounce = (
  callack: any,
  delay: number | undefined,
  dependencies?: DependencyList
) => {
  const { clear, reset } = useTimeout(callack, delay);
  useEffect(reset, [...(!!dependencies ? dependencies : []), reset]);
  useEffect(clear, [clear]);
};

export default useDebounce;
