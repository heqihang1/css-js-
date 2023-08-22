import * as requestFromServer from "./rejectReasonCrud";
import { rejectReasonSlice, callTypes } from "./rejectReasonSlice";

const { actions } = rejectReasonSlice;

export const findAllRejectReasonsList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllrejectReasons()
    .then((response) => {
      const { reject_reasons } = response.data;
      dispatch(
        actions.findAllrejectReasons({
          totalCount: reject_reasons.length,
          entities: reject_reasons,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find reject reasons";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRejectReasons = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findRejectReasons(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.rejectReasonsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find reject reasons";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRejectReasonByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.rejectReasonFetched({ districtForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getrejectReasonByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.rejectReasonFetched({
          districtForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find reject reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteRejectReason = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteRejectReason(id)
    .then((response) => {
      // dispatch(actions.districtDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete reject reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRejectReason = (districtForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createRejectReason(districtForCreation);
};

export const updatRejectReason = (district) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateRejectReason(district);
};

export const activateRejectReason = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateRejectReason(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate reject reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
