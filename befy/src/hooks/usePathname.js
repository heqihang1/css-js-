import * as singleSpa from "single-spa";
import { useMount, useSafeState } from "ahooks";
const getV = () => {
  return window.location.pathname;
};
export default () => {
  const [v, setV] = useSafeState(getV());
  useMount(() => {
    window.addEventListener("single-spa:before-routing-event", (evt) => {
      setV(getV());
    });
    singleSpa.start();
  });
  return v;
};
