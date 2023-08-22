import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const REMARKS_URL = API_URL + "remarks/";

// CREATE =>  POST: add a new remark to the server
export function createRemark(remark) {
  return axios.post(REMARKS_URL + "create-remark", remark);
}

// // READ
// // Server should return filtered remarks by productId
// export function getAllProductRemarksByProductId(productId) {
//   return axios.get(`${REMARKS_URL}?productId=${productId}`);
// }

export function getRemarkById(remarkId) {
  return axios.get(`${REMARKS_URL}${remarkId}`);
}

// Server should return sorted/filtered remarks and merge with items from state
// TODO: Change your URL to REAL API, right now URL is 'api/remarksfind/{productId}'. Should be 'api/remarks/find/{productId}'!!!
export function findRemarks(queryParams) {
  return axios.get(`${API_URL}user/remarks`, { params: queryParams });
}

// UPDATE => PUT: update the remark
export function updateRemark(remark) {
  let { remark_name, remark_content } = remark;
  return axios.put(`${REMARKS_URL}edit-remark/${remark._id}`, {
    remark_name,
    remark_content,
  });
}

// DELETE => delete the remark
export function deleteRemark(remarkId) {
  return axios.delete(`${REMARKS_URL}${remarkId}`);
}

// DELETE Remarks by ids
export function deleteRemarks(ids) {
  return axios.delete(`${REMARKS_URL}deleteRemarks`, { ids });
}
