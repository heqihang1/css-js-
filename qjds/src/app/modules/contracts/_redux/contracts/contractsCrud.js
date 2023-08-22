import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";

export const contracts_URL = API_URL + "contracts/";

// CREATE =>  POST: add a new contract to the server
export function createcontract(contract) {
  return axios.post(contracts_URL + "create-contract", contract);
}

// READ
export function getAllcontracts() {
  return axios.get(API_URL + "user/contracts");
}

export function getcontractById(contractId) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return axios.get(`${contracts_URL}${contractId}?isHistory=${(params.isHistory) ? params.isHistory : ''}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts", { params: newQueryParams });
}

export function findpendingcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/pending", {
    params: newQueryParams,
  });
}
export function findapprovedcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/approved", {
    params: newQueryParams,
  });
}
export function findrejectedcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/rejected", {
    params: newQueryParams,
  });
}

export function findclientrejectedcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/client-rejected", {
    params: newQueryParams,
  });
}

export function findterminatedcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/terminated", {
    params: newQueryParams,
  });
}

export function findconfirmedcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/confirmed", {
    params: newQueryParams,
  });
}

export function findspecialpendingcontracts(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/contracts/special-pending", {
    params: newQueryParams,
  });
}

// UPDATE => PUT: update the procuct on the server
export function updatecontract(contract) {
  return axios.put(`${contracts_URL}${contract.id}`, contract);
}

// UPDATE Status
export function updateStatusForcontracts(ids, status) {
  return axios.post(`${contracts_URL}/updateStatusForcontracts`, {
    ids,
    status,
  });
}

// DELETE => delete the contract from the server
export function deletecontract(contractId) {
  return axios.delete(`${contracts_URL}${contractId}`);
}

// DELETE contracts by ids
export function deletecontracts(ids) {
  return axios.post(`${contracts_URL}/deletecontracts`, { ids });
}

export function getCustomerContracts(queryParams, id) {
  return axios.get(`${contracts_URL}customer/${id}`, { params: queryParams });
}

// approve contract
export function approvecontract(id) {
  return axios.patch(`${contracts_URL}approve/${id}`);
}

export function approveSpecialEdit(id) {
  return axios.patch(`${contracts_URL}approve-special-edit/${id}`);
}

export function rejectSpecialEdit(id) {
  return axios.patch(`${contracts_URL}reject-special-edit/${id}`);
}

// REUSE CONTRACT
export function reuseContract(id) {
  console.log("reuse contract clicked", id);
  return axios.post(`${contracts_URL}reuse/${id}`);
}

// confirm contract
export function confirmcontract(id, payload) {
  return axios.patch(`${contracts_URL}confirm/${id}`, payload);
}

// 拆分工作单接口
export function separateConfirmContractApi(id, payload) {
  return axios.patch(`${contracts_URL}confirm-and-create-job-orders/${id}`, payload);
}

export function rejectClientContract(id, payload) {
  return axios.patch(`${contracts_URL}client-reject/${id}`, payload);
}

export function terminateContract(id, payload) {
  return axios.patch(`${contracts_URL}client-terminate/${id}`, payload);
}

export function updateNextRemindMonth(id, payload) {
  return axios.put(`${contracts_URL}next-remind-month/${id}`, payload);
}

export function uploadDocumentContract(id, payload) {
  return axios.patch(`${contracts_URL}upload-document/${id}`, payload);
}

// reject contract
export function rejectcontract(id) {
  return axios.patch(`${contracts_URL}reject/${id}`);
}

// Change status
export function changecontractsStatus(id, data) {
  return axios.patch(`${contracts_URL}change-status/${id}`, data);
}

export function createJobOrder(id, data) {
  return axios.patch(`${contracts_URL}create-job-order/${id}`, data);
}
