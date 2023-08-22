import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";

export const Customers_URL = API_URL + "customers/";

// CREATE =>  POST: add a new Customer to the server
export function createCustomer(Customer) {
  return axios.post(Customers_URL + "create-customer", Customer);
}

// READ
export function getAllCustomers() {
  return axios.get(API_URL + "user/customers");
}

export function getCustomerById(CustomerId) {
  return axios.get(`${Customers_URL}${CustomerId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCustomers(queryParams, isNoPass) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")

  const searchOfficer = queryParams?.do_not_search_customer || true
  const newQueryParams = hasPermissions ? queryParams : searchOfficer ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "customer_officer_id": localStorage.getItem("user_id")
    }
  }
  console.log("jigar queryParams", isNoPass)
  return axios.get(API_URL + "user/customers", { params: isNoPass ? queryParams : newQueryParams });
}

export function findCustomersList(queryParams) {
  const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
  const newQueryParams = hasPermissions ? queryParams : {
    ...queryParams, filter: {
      ...queryParams.filter,
      "original_customer_officer_id": localStorage.getItem("user_id")
    }
  }
  return axios.get(API_URL + "user/customers/list", { params: newQueryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateCustomer(Customer) {
  return axios.put(`${Customers_URL}edit-customer/${Customer._id}`, Customer);
}

// UPDATE Status
export function updateStatusForCustomers(ids, status) {
  return axios.post(`${Customers_URL}/updateStatusForCustomers`, {
    ids,
    status,
  });
}

// DELETE => delete the Customer from the server
export function deleteCustomer(CustomerId) {
  return axios.delete(`${Customers_URL}delete-customer/${CustomerId}`);
}

// DELETE Customers by ids
export function deleteCustomers(ids) {
  return axios.post(`${Customers_URL}/deleteCustomers`, { ids });
}

// check customer name
export function checkCustomerName(name) {
  return axios.get(`${Customers_URL}check-customer-name/${name}`);
}

export function addLocation(location, customer_id) {
  return axios.post(`${Customers_URL}add-location/${customer_id}`, location);
}

export function editLocation(location, location_id) {
  return axios.put(`${Customers_URL}edit-location/${location_id}`, location);
}
export function deleteLocation(location_id) {
  return axios.delete(`${Customers_URL}delete-location/${location_id}`);
}

export function addContact(contact, customer_id) {
  return axios.post(`${Customers_URL}add-contact/${customer_id}`, contact);
}

export function editContact(contact, contact_id) {
  return axios.put(`${Customers_URL}edit-contact/${contact_id}`, contact);
}
export function deleteContact(contact_id) {
  return axios.delete(`${Customers_URL}delete-contact/${contact_id}`);
}
