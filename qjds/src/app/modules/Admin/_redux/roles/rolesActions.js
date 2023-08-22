import * as requestFromServer from "./rolesCrud";
import { rolesSlice, callTypes } from "./rolesSlice";

const { actions } = rolesSlice;

export const findroles = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.findroles(queryParams).then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(actions.rolesFetched({ totalCount: totalDocs, entities: docs }));
    }).catch((error) => {
      error.clientMessage = "Can't find roles";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchrole = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.roleFetched({ roleForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.getroleById(id).then((response) => {
      const role = response.data;
      dispatch(actions.roleFetched({ roleForEdit: role }));
    }).catch((error) => {
      error.clientMessage = "Can't find role";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleterole = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.deleterole(id).then((response) => {
      dispatch(actions.roleDeleted({ id }));
    }).catch((error) => {
      error.clientMessage = "Can't delete role";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createrole = (roleForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createrole(roleForCreation);
};

export const updaterole = (role) => (dispatch) => {
  //dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updaterole(role);
};

export const updaterolesStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForroles(ids, status)
    .then(() => {
      dispatch(actions.rolesStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update roles status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteroles = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.deleteroles(ids).then(() => {
      dispatch(actions.rolesDeleted({ ids }));
    }).catch((error) => {
      error.clientMessage = "Can't delete roles";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
