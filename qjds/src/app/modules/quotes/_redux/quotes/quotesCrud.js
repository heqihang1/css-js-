import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";

export const quotations_URL = API_URL + "quotations/";

// CREATE =>  POST: add a new quotation to the server
export function createquotation(quotation) {
  return axios.post(quotations_URL + "create-quote", quotation);
}

// READ
export function getAllquotations() {
  return axios.get(API_URL + "user/quotations");
}

export function getquotationById(quotationId) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return axios.get(`${quotations_URL}${quotationId}?isHistory=${(params.isHistory) ? params.isHistory : ''}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations", { params: newQueryParams });
}

export function findjobquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations", { params: newQueryParams });
}

export function findpendingquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/pending", {
    params: newQueryParams,
  });
}
export function findapprovedquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/approved", {
    params: newQueryParams,
  });
}
export function findrejectedquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/rejected", {
    params: newQueryParams,
  });
}
export function findclientrejectedquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/client-rejected", {
    params: newQueryParams,
  });
}
export function findconfirmedquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/confirmed", {
    params: newQueryParams,
  });
}

export function findspecialpendingdquotations(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/quotations/special-pending", {
    params: newQueryParams,
  });
}

// UPDATE => PUT: update the procuct on the server
export function updatequotation(quotation) {
  return axios.put(`${quotations_URL}${quotation.id}`, quotation);
}

// UPDATE Status
export function updateStatusForquotations(ids, status) {
  return axios.post(`${quotations_URL}/updateStatusForquotations`, {
    ids,
    status,
  });
}

// REUSE QUOTATION
export function reuseQuotation(id) {
  console.log("reuse contract clicked", id);
  return axios.post(`${quotations_URL}reuse/${id}`);
}

// DELETE => delete the quotation from the server
export function deletequotation(quotationId) {
  return axios.delete(`${quotations_URL}${quotationId}`);
}

// DELETE quotations by ids
export function deletequotations(ids) {
  return axios.post(`${quotations_URL}/deletequotations`, { ids });
}

export function getCustomerQuotes(queryParams, id) {
  return axios.get(`${quotations_URL}customer/${id}`, { params: queryParams });
}

export function approvequotation(id) {
  return axios.patch(`${quotations_URL}approve/${id}`);
}

export function approveSpecialEdit(id) {
  return axios.patch(`${quotations_URL}approve-special-edit/${id}`);
}

export function rejectSpecialEdit(id) {
  return axios.patch(`${quotations_URL}reject-special-edit/${id}`);
}

// confirm quotation
export function confirmquotation(id, payload) {
  return axios.patch(`${quotations_URL}confirm/${id}`, payload);
}

export function rejectClientQuotation(id, payload) {
  return axios.patch(`${quotations_URL}client-reject/${id}`, payload);
}

export function uploadDocumentQuotation(id, payload) {
  return axios.patch(`${quotations_URL}upload-document/${id}`, payload);
}

// reject quotation
export function rejectquotation(id) {
  return axios.patch(`${quotations_URL}reject/${id}`);
}

// Change status
export function changequotesStatus(id, data) {
  return axios.patch(`${quotations_URL}change-status/${id}`, data);
}

export function createJobOrder(id, data) {
  return axios.patch(`${quotations_URL}create-job-order/${id}`, data);
}
