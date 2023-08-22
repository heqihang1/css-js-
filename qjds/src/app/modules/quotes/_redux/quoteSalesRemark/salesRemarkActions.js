import * as requestFromServer from "./salesRemarkCrud";
import { salesRemarkSlice, callTypes } from "./salesRemarkSlice";

const { actions } = salesRemarkSlice;

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

export const readQuoteSalesRemark = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.readQuotationSalesRemark(id)
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
