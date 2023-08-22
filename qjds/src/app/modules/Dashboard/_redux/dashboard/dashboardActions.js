import * as requestFromServer from "./dashboardCrud";
import { dashboardSlice, callTypes } from "./dashboardSlice";

const { actions } = dashboardSlice;

export const getContractStats = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getContractStats()
    .then(({ data }) => {
      dispatch(actions.contractStatsFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't get contract stats";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const getQuotesStats = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getQuotesStats()
    .then(({ data }) => {
      dispatch(actions.quotesStatsFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't get Quote stats";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
