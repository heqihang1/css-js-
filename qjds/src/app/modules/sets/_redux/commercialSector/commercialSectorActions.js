import * as requestFromServer from "./commercialSectorCrud";
import { commercialSectorSlice, callTypes } from "./commercialSectorSlice";

const { actions } = commercialSectorSlice;

export const findAllCommercialSectorsList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllcommercialSectors()
    .then((response) => {
      const { commercial_sectors } = response.data;
      dispatch(
        actions.findAllcommercialSectors({
          totalCount: commercial_sectors.length,
          entities: commercial_sectors,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find commercial sectors";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCommercialSectors = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCommercialSectors(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.commercialSectorsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find commercial sector";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCommercialSectorByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.commercialSectorFetched({ districtForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getcommercialSectorByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.commercialSectorFetched({
          districtForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find commercial sector";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCommercialSector = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCommercialSector(id)
    .then((response) => {
      // dispatch(actions.districtDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete commercial sector";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createCommercialSector = (districtForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createCommercialSector(districtForCreation);
};

export const updatCommercialSector = (district) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateCommercialSector(district);
};

export const activateCommercialSector = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateCommercialSector(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate commercial sector";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
