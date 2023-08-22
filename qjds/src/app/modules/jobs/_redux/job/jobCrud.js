import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";

export const PRODUCTS_URL = API_URL + "jobs/";

// READ
export function getAllJobs(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_id.customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(PRODUCTS_URL + "all", { params: newQueryParams });
}

export function getAllJobsByTeam(id, queryParams) {
  return axios.get(PRODUCTS_URL + `teams/${id}`, { params: queryParams });
}

// GET BY ID
export function getJobById(id) {
  return axios.get(PRODUCTS_URL + `${id}`);
}

// APPROVE JOB ORDER
export function approveJobOrder(id) {
  return axios.patch(PRODUCTS_URL + `approve/${id}`);
}

// REJECT JOB ORDER
export function rejectJobOrder(id) {
  return axios.patch(PRODUCTS_URL + `reject/${id}`);
}

// CANCEL JOB ORDER
export function cancelJobOrder(id) {
  return axios.patch(PRODUCTS_URL + `cancel/${id}`);
}

// RESCHEDULE JOB ORDER
export function rescheduleJobOrder(id, payload) {
  return axios.patch(PRODUCTS_URL + `re-schedule/${id}`, payload);
}

export function editJobOrder(job) {
  return axios.put(`${PRODUCTS_URL}${job.id}`, job);
}

export function fetchJobsByContractQuotationNo(search) {
  return axios.get(`${PRODUCTS_URL}contract_quotation?search=${search}`);
}

export function jobAssignTeam(id, payload) {
  return axios.patch(PRODUCTS_URL + `team/assign/${id}`, payload);
}

export function jobUpdateAssignTeam(id, payload) {
  return axios.patch(PRODUCTS_URL + `update-team/assign/${id}`, payload);
}

export function jobUnassignTeam(id, payload) {
  return axios.patch(PRODUCTS_URL + `unassign/${id}`, payload);
}

export function uploadDocumentJob(id, payload) {
  return axios.patch(`${PRODUCTS_URL}upload-document/${id}`, payload);
}

export function updatejob(job) {
  return axios.put(`${PRODUCTS_URL}${job.id}`, job);
}

export function reuseJob(id, data) {
  return axios.post(`${PRODUCTS_URL}reuse/${id}`, data);
}
