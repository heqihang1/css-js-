import axios from "axios";
import { API_URL } from "../../../../API_URL";

// READ Quotes Stats
export function getQuotesStats() {
  return axios.get(API_URL + "dashboard/quotes");
}

// READ Contract Stats

export function getContractStats(contractId) {
  return axios.get(API_URL + "dashboard/contracts");
}
