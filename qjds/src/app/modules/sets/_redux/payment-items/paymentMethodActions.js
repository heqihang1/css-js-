import * as requestFromServer from "./paymentMethodCrud";
import { paymentMethodsSlice, callTypes } from "./paymentMethodSlice";

const { actions } = paymentMethodsSlice;

export const findpaymentMethods = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findpaymentMethods(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.paymentMethodsFetched({ totalCount: totalDocs, entities: docs })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find paymentMethods";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchpaymentMethod = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.paymentMethodFetched({ paymentMethodForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getpaymentMethodById(id)
    .then((response) => {
      const paymentMethod = response.data._doc;
      dispatch(
        actions.paymentMethodFetched({ paymentMethodForEdit: paymentMethod })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find paymentMethod";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletepaymentMethod = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletepaymentMethod(id)
    .then((response) => {
      dispatch(actions.paymentMethodDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete paymentMethod";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createpaymentMethod = (paymentMethodForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createpaymentMethod(paymentMethodForCreation);
};

export const updatepaymentMethod = (paymentMethod) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updatepaymentMethod(paymentMethod);
};

export const updatepaymentMethodsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForpaymentMethods(ids, status)
    .then(() => {
      dispatch(actions.paymentMethodsStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update paymentMethods status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletepaymentMethods = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletepaymentMethods(ids)
    .then(() => {
      dispatch(actions.paymentMethodsDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete paymentMethods";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const findbanks = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.findbanks(queryParams);
};

export const findpaymentClearMethods = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.findpaymentClearMethods(queryParams);
};
