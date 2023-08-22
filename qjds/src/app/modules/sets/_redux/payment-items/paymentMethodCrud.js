import axios from "axios";
import { API_URL } from "../../../../API_URL";

export const paymentMethodS_URL = API_URL + "payment_methods/";

// CREATE =>  POST: add a new paymentMethod to the server
export function createpaymentMethod(paymentMethod) {
  return axios.post(
    paymentMethodS_URL + "create-payment_method",
    paymentMethod
  );
}

// // READ
// export function getAllpaymentMethods() {
//   return axios.get(API_URL + "user/payment-methods");
// }

export function getpaymentMethodById(paymentMethodId) {
  return axios.get(`${paymentMethodS_URL}${paymentMethodId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findpaymentMethods(queryParams) {
  return axios.get(API_URL + "user/payment_methods", { params: queryParams });
}

// UPDATE => PUT: update the paymentMethod on the server
export function updatepaymentMethod(paymentMethod) {
  let { payment_method_name, payment_method_content, over_due_day } = paymentMethod;
  return axios.put(
    `${paymentMethodS_URL}edit-payment_method/${paymentMethod._id}`,
    {
      payment_method_name,
      payment_method_content,
      over_due_day
    }
  );
}

// UPDATE Status
export function updateStatusForpaymentMethods(ids, status) {
  return axios.post(`${paymentMethodS_URL}/updateStatusForpaymentMethods`, {
    ids,
    status,
  });
}

// DELETE => delete the paymentMethod from the server
export function deletepaymentMethod(paymentMethodId) {
  return axios.delete(`${paymentMethodS_URL}${paymentMethodId}`);
}

// DELETE paymentMethods by ids
export function deletepaymentMethods(ids) {
  return axios.post(`${paymentMethodS_URL}/deletepaymentMethods`, { ids });
}

export function findbanks(queryParams) {
  return axios.get(API_URL + "banks", { params: queryParams });
}

export function findpaymentClearMethods(queryParams) {
  return axios.get(API_URL + "payment_clear_methods", { params: queryParams });
}
