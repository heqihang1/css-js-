import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const teams_URL = API_URL + "teams/";

export function createTeam(team) {
  return axios.post(teams_URL + "create", team);
}

export function getTeamByID(id) {
  return axios.get(`${teams_URL}${id}`);
}

export function findTeams(queryParams) {
  return axios.get(`${API_URL}/teams`, { params: queryParams });
}

export function updateTeam(team) {
  let { carPlateNumber, password } = team;
  return axios.put(`${teams_URL}edit/${team._id}`, {
    carPlateNumber,
    password,
  });
}

export function deleteTeam(id) {
  return axios.delete(`${teams_URL}${id}`);
}

export function acitivateTeam(id) {
  return axios.put(`${teams_URL}active/${id}`);
}

export function getActiveTeams(id = '') {
  return axios.get(`${teams_URL}active?id=${id}`);
}
