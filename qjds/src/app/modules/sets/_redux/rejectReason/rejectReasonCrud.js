import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const rejectReason_URL = API_URL + "reject_reason/";

export function findAllrejectReasons() {
  return axios.get(rejectReason_URL + "all");
}

export function createRejectReason(district) {
  return axios.post(rejectReason_URL + "create", district);
}

export function getrejectReasonByID(id) {
  return axios.get(`${rejectReason_URL}${id}`);
}

export function findRejectReasons(queryParams) {
  return axios.get(`${rejectReason_URL}`, { params: queryParams });
}

export function updateRejectReason(rejRes) {
  let { reject_reason } = rejRes;
  return axios.put(`${rejectReason_URL}edit/${rejRes._id}`, {
    reject_reason
  });
}

export function deleteRejectReason(id) {
  return axios.delete(`${rejectReason_URL}${id}`);
}

export function acitivateRejectReason(id) {
  return axios.put(`${rejectReason_URL}active/${id}`);
}
