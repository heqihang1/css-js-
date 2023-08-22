import * as requestFromServer from "./quotesCrud";
import { quotationsSlice, callTypes } from "./quotesSlice";

const { actions } = quotationsSlice;

export const findquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findjobquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findjobquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findapprovedquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findapprovedquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findpendingquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findpendingquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findrejectedquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findrejectedquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findclientrejectedquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findclientrejectedquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
export const findconfirmedquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findconfirmedquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findspecialpendingdquotations = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findspecialpendingdquotations(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findcustomerquotations = (queryParams, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getCustomerQuotes(queryParams, id)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      // docs.map((doc) => {
      //   let total = 0;
      //   for (let service of doc.services) {
      //     total +=
      //       service.feet *
      //       Number(service?.price || 0) *
      //       ((100 - service.discount) / 100);
      //   }
      //   doc.amount = total;
      //   return doc;
      // });
      dispatch(
        actions.quotationsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchquotation = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.quotationFetched({ quotationForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getquotationById(id)
    .then((response) => {
      let quotation = response.data;
      dispatch(actions.quotationFetched({ quotationForEdit: quotation }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find quotation";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// REUSE QUOTATION
export const reuseQuotation = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.reuseQuotation(id);
};

export const deletequotation = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletequotation(id)
    .then((response) => {
      dispatch(actions.quotationDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete quotation";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const confirmQuotation = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .confirmquotation(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't confirm quotation";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const rejectClientQuotation = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .rejectClientQuotation(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't reject quotation";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const uploadDocumentQuotation = (id, payload) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .uploadDocumentQuotation(id, payload)
    .then((response) => {})
    .catch((error) => {
      error.clientMessage = "Can't confirm quotation";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createquotation = (quotationForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createquotation(quotationForCreation);
};

export const updatequotation = (quotation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.updatequotation(quotation);
};
export const updatequotationsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForquotations(ids, status)
    .then(() => {
      dispatch(actions.quotationsStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update quotations status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletequotations = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletequotations(ids)
    .then(() => {
      dispatch(actions.quotationsDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete quotations";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const changequotesStatus = (id, data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.changequotesStatus(id, data);
};
