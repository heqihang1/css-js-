import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const commercialSec_URL = API_URL + "commercial_sector/";

export function findAllcommercialSectors() {
  return axios.get(commercialSec_URL + "all");
}

export function createCommercialSector(district) {
  return axios.post(commercialSec_URL + "create", district);
}

export function getcommercialSectorByID(id) {
  return axios.get(`${commercialSec_URL}${id}`);
}

export function findCommercialSectors(queryParams) {
  return axios.get(`${commercialSec_URL}`, { params: queryParams });
}

export function updateCommercialSector(comSec) {
  let { commercial_sector_name } = comSec;
  return axios.put(`${commercialSec_URL}edit/${comSec._id}`, {
    commercial_sector_name
  });
}

export function deleteCommercialSector(id) {
  return axios.delete(`${commercialSec_URL}${id}`);
}

export function acitivateCommercialSector(id) {
  return axios.put(`${commercialSec_URL}active/${id}`);
}
