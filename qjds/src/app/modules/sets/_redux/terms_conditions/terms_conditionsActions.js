import * as requestFromServer from "./terms_conditionsCrud";
import { terms_conditionsSlice, callTypes } from "./terms_conditionsSlice";

const { actions } = terms_conditionsSlice;

export const fetchterms_conditions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findterms_conditions(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.terms_conditionsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find terms_conditions";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchterms_condition = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.terms_conditionFetched({ terms_conditionForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getterms_conditionById(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.terms_conditionFetched({
          terms_conditionForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find terms_condition";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteterms_condition = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteterms_condition(id)
    .then((response) => {
      dispatch(actions.terms_conditionDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete terms_condition";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createterms_condition = (terms_conditionForCreation) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createterms_condition(terms_conditionForCreation);
};

export const updateterms_condition = (terms_condition) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateterms_condition(terms_condition);
};

export const deleteterms_conditions = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteterms_conditions(ids)
    .then(() => {
      console.log("delete return");
      dispatch(actions.terms_conditionsDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete terms_conditions";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
