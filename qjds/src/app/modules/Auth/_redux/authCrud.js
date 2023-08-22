import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL;
export const LOGIN_URL = `${API_URL}users/login`;
export const REGISTER_URL = API_URL + "users/create-user";
export const REQUEST_PASSWORD_URL = API_URL + "users/send-reset-link";
export const ME_URL = `${API_URL}users/user`;

export function login(username, password) {
  return axios.post(LOGIN_URL, { username, password });
}

export function register(newUser) {
  return axios.post(REGISTER_URL, newUser);
}

export function requestPassword(email) {
  return axios.get(REQUEST_PASSWORD_URL + "/" + email);
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
