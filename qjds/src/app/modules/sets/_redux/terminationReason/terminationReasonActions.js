import * as requestFromServer from "./terminationReasonCrud";
import { terminationReasonSlice, callTypes } from "./terminationReasonSlice";

const { actions } = terminationReasonSlice;

export const findAllTerminationReasonsList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllterminationReasons()
    .then((response) => {
      const { termination_reasons } = response.data;
      dispatch(
        actions.findAllterminationReasons({
          totalCount: termination_reasons.length,
          entities: termination_reasons,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find termination reasons";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTerminationReasons = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findTerminationReasons(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.terminationReasonsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find termination reasons";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTerminationReasonByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.terminationReasonFetched({ districtForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getterminationReasonByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.terminationReasonFetched({
          districtForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find termination reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteTerminationReason = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTerminationReason(id)
    .then((response) => {
      // dispatch(actions.districtDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete termination reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createTerminationReason = (districtForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createTerminationReason(districtForCreation);
};

export const updatTerminationReason = (district) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateTerminationReason(district);
};

export const activateTerminationReason = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateTerminationReason(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate termination reason";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
