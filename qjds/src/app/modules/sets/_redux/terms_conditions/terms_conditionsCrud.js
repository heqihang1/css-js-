import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const terms_conditionS_URL = API_URL + "terms_conditions/";

// CREATE =>  POST: add a new terms_condition to the server
export function createterms_condition(terms_condition) {
  return axios.post(
    terms_conditionS_URL + "create-terms_conditions",
    terms_condition
  );
}

// // READ
// // Server should return filtered terms_conditions by productId
// export function getAllProductterms_conditionsByProductId(productId) {
//   return axios.get(`${terms_conditionS_URL}?productId=${productId}`);
// }

export function getterms_conditionById(terms_conditionId) {
  return axios.get(`${terms_conditionS_URL}${terms_conditionId}`);
}

// Server should return sorted/filtered terms_conditions and merge with items from state
// TODO: Change your URL to REAL API, right now URL is 'api/terms_conditionsfind/{productId}'. Should be 'api/terms_conditions/find/{productId}'!!!
export function findterms_conditions(queryParams) {
  return axios.get(`${API_URL}user/terms_conditions`, { params: queryParams });
}

// UPDATE => PUT: update the terms_condition
export function updateterms_condition(terms_condition) {
  let { terms_conditions_name, terms_conditions_content } = terms_condition;
  return axios.put(
    `${terms_conditionS_URL}edit-terms_conditions/${terms_condition._id}`,
    {
      terms_conditions_name,
      terms_conditions_content,
    }
  );
}

// DELETE => delete the terms_condition
export function deleteterms_condition(terms_conditionId) {
  return axios.delete(`${terms_conditionS_URL}${terms_conditionId}`);
}

// DELETE terms_conditions by ids
export function deleteterms_conditions(ids) {
  return axios.delete(`${terms_conditionS_URL}deleteterms_conditions`, { ids });
}
