import axios from "axios";
import { API_URL } from "../../../../API_URL";

export const role_URL = API_URL + "roles/";

// CREATE =>  POST: add a new role to the server  添加角色
export function createrole(role) {
  return axios.post(role_URL + "create-role", role);
}

export function getroleById(roleId) {
  return axios.get(`${role_URL}${roleId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findroles(queryParams) {
  return axios.get(role_URL, { params: queryParams });
}

// UPDATE => PUT: update the role on the server   更新角色
export function updaterole(role) {
  return axios.put(`${role_URL}${role._id}`, {
    rolename: role.rolename,
    rights: role.rights,
  });
}

// UPDATE Status  更新状态
export function updateStatusForroles(ids, status) {
  return axios.post(`${role_URL}/updateStatusForroles`, {
    ids,
    status,
  });
}

// // DELETE => delete the role from the server  删除角色
export function deleterole(roleId) {
  return axios.delete(`${role_URL}${roleId}`);
}

// DELETE roles by ids   按 id删除角色？
export function deleteroles(ids) {
  return axios.post(`${role_URL}/deleteroles`, { ids });
}
