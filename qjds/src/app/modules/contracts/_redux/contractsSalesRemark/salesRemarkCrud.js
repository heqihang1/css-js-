import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const sales_remark_URL = API_URL + "contracts/";

export function findAllSalesRemark(queryParams, id) {
  return axios.get(sales_remark_URL + "sales-remark/" + id, { params: queryParams });
}

export function readContractSalesRemark(id) {
  return axios.get(`${sales_remark_URL}sales-remark/read/${id}`)
}

export function createSalesRemark(postData) {
  return axios.post(sales_remark_URL + "create-sales-remark", postData);
}

export function deleteSalesRemark(id) {
  return axios.delete(`${sales_remark_URL}delete-sales-remark/${id}`);
}
