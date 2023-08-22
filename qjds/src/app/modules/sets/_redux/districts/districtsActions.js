import * as requestFromServer from "./districtsCrud";
import { districtsSlice, callTypes } from "./districtSlice";

const { actions } = districtsSlice;

export const findAllDistrictsList = (id = '') => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllDistricts(id)
    .then((response) => {
      const { disctrict } = response.data;
      dispatch(
        actions.findAllDistricts({ totalCount: disctrict.length, entities: disctrict })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find districts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDistricts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findDistricts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.districtsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find district";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDistrictByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.districtFetched({ districtForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getDistrictByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.districtFetched({
          districtForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find district";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDistrict = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteDistrict(id)
    .then((response) => {
      // dispatch(actions.districtDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete district";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createDistrict = (districtForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createDistrict(districtForCreation);
};

export const updateDistrict = (district) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateDistrict(district);
};

export const activateDistrict = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateDistrict(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate district";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};