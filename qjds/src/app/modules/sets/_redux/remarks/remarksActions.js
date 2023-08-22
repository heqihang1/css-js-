import * as requestFromServer from "./remarksCrud";
import { remarksSlice, callTypes } from "./remarksSlice";

const { actions } = remarksSlice;

export const fetchRemarks = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findRemarks(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.remarksFetched({ totalCount: totalDocs, entities: docs })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find remarks";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRemark = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.remarkFetched({ remarkForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getRemarkById(id)
    .then((response) => {
      const remark = response.data;
      dispatch(actions.remarkFetched({ remarkForEdit: remark }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find remark";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteRemark = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteRemark(id)
    .then((response) => {
      dispatch(actions.remarkDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete remark";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRemark = (remarkForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createRemark(remarkForCreation);
};

export const updateRemark = (remark) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateRemark(remark);
};

export const deleteRemarks = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteRemarks(ids)
    .then(() => {
      console.log("delete return");
      dispatch(actions.remarksDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete remarks";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
