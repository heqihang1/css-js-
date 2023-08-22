import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const districts_URL = API_URL + "district/";

export function findAllDistricts(id = '') {
  return axios.get(districts_URL + "all?id=" + id);
}

export function createDistrict(district) {
  return axios.post(districts_URL + "create", district);
}

export function getDistrictByID(id) {
  return axios.get(`${districts_URL}${id}`);
}

export function findDistricts(queryParams) {
  return axios.get(`${districts_URL}`, { params: queryParams });
}

export function updateDistrict(district) {
  let { district_eng_name, district_chi_name } = district;
  return axios.put(`${districts_URL}edit/${district._id}`, {
    district_eng_name,
    district_chi_name,
  });
}

export function deleteDistrict(id) {
  return axios.delete(`${districts_URL}${id}`);
}

export function acitivateDistrict(id) {
  return axios.put(`${districts_URL}active/${id}`);
}
