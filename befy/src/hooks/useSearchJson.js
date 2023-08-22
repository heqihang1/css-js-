import * as singleSpa from "single-spa";
import { useMount, useSafeState } from "ahooks";
import qs from "qs";

const getV = () => {
  try {
    let search = window.location.search;
    search = search.substring(1);
    return qs.parse(search);
  } catch (e) {
    return {};
  }
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
