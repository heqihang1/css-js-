import * as requestFromServer from "./questionCrud";
import { questionSlice, callTypes } from "./questionSlice";

const { actions } = questionSlice;

export const findAllQuestionsList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllquestions()
    .then((response) => {
      const { questions } = response.data;
      dispatch(
        actions.findAllquestions({
          totalCount: questions.length,
          entities: questions,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find questions";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchQuestions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findQuestions(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.questionsFetched({
          totalCount: totalDocs,
          entities: docs,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find questions";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchQuestionByID = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.questionFetched({ districtForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getquestionByID(id)
    .then((response) => {
      const terms_condition = response.data;
      dispatch(
        actions.questionFetched({
          districtForEdit: terms_condition,
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find questions";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteQuestion = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteQuestion(id)
    .then((response) => {
      // dispatch(actions.districtDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete questions";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createQuestion = (districtForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createQuestion(districtForCreation);
};

export const updatQuestion = (district) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updateQuestion(district);
};

export const activateQuestion = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .acitivateQuestion(id)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't activate questions";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
