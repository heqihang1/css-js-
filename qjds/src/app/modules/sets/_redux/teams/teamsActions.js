import * as requestFromServer from "./teamsCrud";
import { teamSlice, callTypes } from "./teamsSlice";

const { actions } = teamSlice;

export const fetchTeams = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findTeams(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.teamsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find team";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTeamByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.teamFetched({ teamForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getTeamByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.teamFetched({
          teamForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find team";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteTeam = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTeam(id)
    .then((response) => {
      // dispatch(actions.teamDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete team";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createTeam = (teamForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createTeam(teamForCreation);
};

export const updateTeam = (team) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateTeam(team);
};

export const activateTeam = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateTeam(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate team";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
