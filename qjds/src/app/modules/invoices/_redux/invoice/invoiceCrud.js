import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";
export const PRODUCTS_URL = API_URL + "invoices";

// CREATE =>  POST: add a new quotation to the server
export function createinvoice(invoice) {
  return axios.post(PRODUCTS_URL + "/create-invoice", invoice);
}

// CREATE =>  POST: add a new product to the server
export function createProduct(product) {
  return axios.post(PRODUCTS_URL, { product });
}

// READ
export function getAllInvoices(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(PRODUCTS_URL + "/all", { params: newQueryParams });
}

export function getPendingInvoice() {
  return axios.get(PRODUCTS_URL + "/pending-invoice");
}

// READ
export function getRejectedInvoices(queryParams) {
  return axios.get(PRODUCTS_URL + "/rejected", { params: queryParams });
}

// READ
export function getApprovedInvoices(queryParams) {
  return axios.get(PRODUCTS_URL + "/approved", { params: queryParams });
}

// READ
export function getPaidInvoices(queryParams) {
  return axios.get(PRODUCTS_URL + "/paid", { params: queryParams });
}
// READ
export function getPaymentPendingInvoices(queryParams) {
  return axios.get(PRODUCTS_URL + "/payment-pending", { params: queryParams });
}

export function getInvoiceById(invoiceId) {
  return axios.get(`${PRODUCTS_URL}/details/${invoiceId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findProducts(queryParams) {
  return axios.post(`${PRODUCTS_URL}/find`, { queryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateProduct(product) {
  return axios.put(`${PRODUCTS_URL}/${product.id}`, { product });
}

// UPDATE Status
export function updateStatusForProducts(ids, status) {
  return axios.post(`${PRODUCTS_URL}/updateStatusForProducts`, {
    ids,
    status,
  });
}

// DELETE => delete the product from the server
export function deleteInvoice(invoiceId) {
  return axios.delete(`${PRODUCTS_URL}/${invoiceId}`);
}

// DELETE Products by ids
export function deleteProducts(ids) {
  return axios.post(`${PRODUCTS_URL}/deleteProducts`, { ids });
}

export function fetchReportInvoices(search, from, to, customer, is_download) {
  return axios.get(`${PRODUCTS_URL}/report?search=${search}&from=${from}&to=${to}&customer=${(customer) ? customer : ''}&is_download=${is_download}`);
}

export function fetchInvoicesByContractQuotationNo(search) {
  return axios.get(`${PRODUCTS_URL}/contract-quotation?search=${search}`);
}

export function invoicePayment(data) {
  return axios.post(PRODUCTS_URL + "/payment", data);
}

export function fetchInvoicePaidAmt(search) {
  return axios.get(`${PRODUCTS_URL}/paid-amt?search=${search}`);
}

export function approveInvoice(id) {
  return axios.patch(`${PRODUCTS_URL}/approve/${id}`);
}

export function rejectInvoice(id) {
  return axios.patch(`${PRODUCTS_URL}/reject/${id}`);
}
