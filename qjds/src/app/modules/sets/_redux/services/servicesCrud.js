import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const serviceS_URL = API_URL + "services/";

// CREATE =>  POST: add a new service to the server
export function createservice(service) {
  return axios.post(serviceS_URL + "create-service", service);
}

// // READ
// // Server should return filtered services by productId
// export function getAllProductservicesByProductId(productId) {
//   return axios.get(`${serviceS_URL}?productId=${productId}`);
// }

export function getserviceById(serviceId) {
  return axios.get(`${serviceS_URL}${serviceId}`);
}

// Server should return sorted/filtered services and merge with items from state
// TODO: Change your URL to REAL API, right now URL is 'api/servicesfind/{productId}'. Should be 'api/services/find/{productId}'!!!
export function findservices(queryParams) {
  return axios.get(`${API_URL}user/services`, { params: queryParams });
}

// UPDATE => PUT: update the service
export function updateservice(service) {
  let { service_name, service_content, service_type, service_price, service_minimum_consumption } = service;
  return axios.put(`${serviceS_URL}edit-service/${service._id}`, {
    service_name,
    service_content,
    service_price,
    service_type,
    service_minimum_consumption
  });
}

// DELETE => delete the service
export function deleteservice(serviceId) {
  return axios.delete(`${serviceS_URL}${serviceId}`);
}

// DELETE services by ids
export function deleteservices(ids) {
  return axios.delete(`${serviceS_URL}deleteservices`, { ids });
}
