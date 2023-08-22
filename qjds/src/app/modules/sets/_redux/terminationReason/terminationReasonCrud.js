import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const terminationReason_URL = API_URL + "termination_reason/";

export function findAllterminationReasons() {
  return axios.get(terminationReason_URL + "all");
}

export function createTerminationReason(district) {
  return axios.post(terminationReason_URL + "create", district);
}

export function getterminationReasonByID(id) {
  return axios.get(`${terminationReason_URL}${id}`);
}

export function findTerminationReasons(queryParams) {
  return axios.get(`${terminationReason_URL}`, { params: queryParams });
}

export function updateTerminationReason(terminationRes) {
  let { termination_reason } = terminationRes;
  return axios.put(`${terminationReason_URL}edit/${terminationRes._id}`, {
    termination_reason
  });
}

export function deleteTerminationReason(id) {
  return axios.delete(`${terminationReason_URL}${id}`);
}

export function acitivateTerminationReason(id) {
  return axios.put(`${terminationReason_URL}active/${id}`);
}
