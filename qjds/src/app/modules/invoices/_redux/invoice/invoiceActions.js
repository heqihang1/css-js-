import * as requestFromServer from "./invoiceCrud";
import { invoiceSlice, callTypes } from "./invoiceSlice";

const { actions } = invoiceSlice;

export const createinvoice = (invoiceForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.createinvoice(invoiceForCreation);
};

export const fetchInvoices = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllInvoices(queryParams)
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
        actions.productsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find invoices";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchPendingInvoices = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getPendingInvoice()
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
      error.clientMessage = "Can't find invoices";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const findapprovedInvoices = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getApprovedInvoices(queryParams)
    .then((response) => {
      const { totalDocs, docs } = response.data;
      docs.map((doc) => {
        let total = 0;
        for (let service of doc.services) {
          total +=
            service.feet *
            Number(service?.price || 0) *
            ((100 - service.discount) / 100);
        }
        doc.amount = total;
        return doc;
      });
      dispatch(
        actions.productsFetched({
          totalCount: totalDocs,
          entities: [...docs],
        })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find invoices";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchInvoice = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getInvoiceById(id);
};

export const deleteInvoice = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteInvoice(id)
    .then((response) => {
      dispatch(actions.productDeleted({ id }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete product";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createProduct = (productForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createProduct(productForCreation)
    .then((response) => {
      const { product } = response.data;
      dispatch(actions.productCreated({ product }));
    })
    .catch((error) => {
      error.clientMessage = "Can't create product";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateProduct = (product) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateProduct(product)
    .then(() => {
      dispatch(actions.productUpdated({ product }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update product";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateProductsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForProducts(ids, status)
    .then(() => {
      dispatch(actions.productsStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      error.clientMessage = "Can't update products status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteProducts = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteProducts(ids)
    .then(() => {
      dispatch(actions.productsDeleted({ ids }));
    })
    .catch((error) => {
      error.clientMessage = "Can't delete products";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchReportInvoices = (search, from, to, customer, is_download) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.fetchReportInvoices(search, from, to, customer, is_download);
};

export const fetchInvoicesByContractQuotationNo = (search) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.fetchInvoicesByContractQuotationNo(search);
};

export const invoicePayment = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer.invoicePayment(data);
};

export const fetchInvoicePaidAmt = (search) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.fetchInvoicePaidAmt(search);
};
