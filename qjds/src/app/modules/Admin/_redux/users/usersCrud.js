import axios from "axios";
import { API_URL } from "../../../../API_URL";

export const user_URL = API_URL + "users/";

// CREATE =>  POST: add a new user to the server  添加用户
export function createuser(user) {
  return axios.post(user_URL + "admin/create-user", user);
}

export function getuserById(userId) {
  return axios.get(`${user_URL}${userId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findusers(queryParams) {
  return axios.get(user_URL, { params: queryParams });
}

// UPDATE => PUT: update the user on the server  更新用户
export function updateuser(user) {
  let { id } = user;
  return axios.put(`${user_URL}admin/edit-user/${id}`, user);
}

// UPDATE Status  更新状态
export function updateStatusForusers(ids, status) {
  return axios.post(`${user_URL}/updateStatusForusers`, {
    ids,
    status,
  });
}

// // DELETE => delete the user from the server 删除用户
export function deleteuser(userId) {
  return axios.delete(`${user_URL}admin/delete-user/${userId}`);
}

export function activateuser(userId) {
  return axios.patch(`${user_URL}admin/activate-user/${userId}`);
}

// DELETE users by ids   按 id删除用户
export function deleteusers(ids) {
  return axios.post(`${user_URL}/deleteusers`, { ids });
}
