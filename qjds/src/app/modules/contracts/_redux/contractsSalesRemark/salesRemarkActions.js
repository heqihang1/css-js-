import * as requestFromServer from "./salesRemarkCrud";
import { contractSalesRemarkSlice, callTypes } from "./salesRemarkSlice";

const { actions } = contractSalesRemarkSlice;

export const findAllSalesRemarkList = (queryParams, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findAllSalesRemark(queryParams, id)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.findAllsalesRemarks({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find sales remark";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const readContractSalesRemark = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.readContractSalesRemark(id)
    .then((res) => { })
    .catch((err) => { })
}

export const deleteSalesRemark = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSalesRemark(id)
    .then((response) => {

    })
    .catch((error) => {
      error.clientMessage = "Can't delete sales remark";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createSalesRemark = (postData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createSalesRemark(postData);
};
