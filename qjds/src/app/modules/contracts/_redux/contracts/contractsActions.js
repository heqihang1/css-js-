import * as requestFromServer from "./contractsCrud";
import { contractsSlice, callTypes } from "./contractsSlice";

const { actions } = contractsSlice;

export const findCustomercontracts = (queryParams, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getCustomerContracts(queryParams, id)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findapprovedcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findapprovedcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findpendingcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findpendingcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findrejectedcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findrejectedcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findclientrejectedcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findclientrejectedcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findterminatedcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findterminatedcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findconfirmedcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findconfirmedcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findspecialpendingcontracts = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findspecialpendingcontracts(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        doc.contract_amount = doc?.contract_amount ? doc?.contract_amount : 0;
        return doc;
      });
      dispatch(
        actions.contractsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find contracts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchcontract = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.contractFetched({ contractForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getcontractById(id)
    .then((response) => {
      let contract = response.data;
      dispatch(actions.contractFetched({ contractForEdit: contract }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const confirmContract = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .confirmcontract(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't confirm contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// 拆分工作单接口
export const separateConfirmContract = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .separateConfirmContractApi(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't confirm contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const rejectClientContract = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .rejectClientContract(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't reject contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const terminateContract = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .terminateContract(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't terminate contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateNextRemindMonth = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateNextRemindMonth(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't update next remind month";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const uploadDocumentContract = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .uploadDocumentContract(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't confirm contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletecontract = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletecontract(id)
    .then((response) => {
      dispatch(actions.contractDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete contract";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createcontract = (contractForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createcontract(contractForCreation);
};

// REUSE CONTRACT
export const reuseContract = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.reuseContract(id);
};

export const updatecontract = (contract) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updatecontract(contract);
};

export const updatecontractsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForcontracts(ids, status)
    .then(() => {
      dispatch(actions.contractsStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update contracts status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletecontracts = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletecontracts(ids)
    .then(() => {
      dispatch(actions.contractsDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete contracts";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const changecontractsStatus = (id, data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.changecontractsStatus(id, data);
};
