import * as requestFromServer from "./servicesCrud";
import { servicesSlice, callTypes } from "./servicesSlice";

const { actions } = servicesSlice;

export const fetchservices = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findservices(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.servicesFetched({ totalCount: totalDocs, entities: docs })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find services";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchservice = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.serviceFetched({ serviceForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getserviceById(id)
    .then((response) => {
      const service = response.data;
      dispatch(actions.serviceFetched({ serviceForEdit: service }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find service";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteservice = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteservice(id)
    .then((response) => {
      dispatch(actions.serviceDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete service";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createservice = (serviceForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createservice(serviceForCreation);
};

export const updateservice = (service) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateservice(service);
};

export const deleteservices = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteservices(ids)
    .then(() => {
      console.log("delete return");
      dispatch(actions.servicesDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete services";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
