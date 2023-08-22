import * as requestFromServer from "./usersCrud";
import { usersSlice, callTypes } from "./usersSlice";

const { actions } = usersSlice;

export const findusers = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.findusers(queryParams).then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(actions.usersFetched({ totalCount: totalDocs, entities: docs }));
    }).catch((error) => {
      error.clientMessage = "Can't find users";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchuser = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.userFetched({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.getuserById(id).then((response) => {
      const user = response.data;
      dispatch(actions.userFetched({ userForEdit: user }));
    }).catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteuser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.deleteuser(id).then((response) => {
      dispatch(actions.userDeleted({ id }));
    }).catch((error) => {
      error.clientMessage = "Can't delete user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const activateuser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.activateuser(id).then((response) => {
      dispatch(actions.userActivate({ id }));
    }).catch((error) => {
      error.clientMessage = "Can't activate user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createuser = (userForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createuser(userForCreation);
};

export const updateuser = (user) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateuser(user);
};

export const updateusersStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateStatusForusers(ids, status).then(() => {
      dispatch(actions.usersStatusUpdated({ ids, status }));
    }).catch((error) => {
      error.clientMessage = "Can't update users status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteusers = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.deleteusers(ids).then(() => {
      dispatch(actions.usersDeleted({ ids }));
    }).catch((error) => {
      error.clientMessage = "Can't delete users";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
