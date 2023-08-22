import * as requestFromServer from "./jobCrud";
import { jobSlice, callTypes } from "./jobSlice";

const { actions } = jobSlice;

export const fetchJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllJobs(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.productsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchJobsTeam = (id, queryParams) => (dispatch) => {
  if (id) {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .getAllJobsByTeam(id, queryParams)
      .then((response) => {
        const { totalDocs, docs } = response.data;
        dispatch(
          actions.productsFetched({
            totalCount: totalDocs,
            entities: [...docs],
          })
        );
      })
      .catch((error) => {
        error.clientMessage = "Can't find jobs";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
};

export const getJobDetails = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.productFetched({ productForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getJobById(id)
    .then((response) => {
      let job = response.data.data;
      dispatch(actions.productFetched({ productForEdit: job }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find job";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchJobsByContractQuotationNo = (search) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.fetchJobsByContractQuotationNo(search);
};

export const updatejob = (job) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updatejob(job);
};
