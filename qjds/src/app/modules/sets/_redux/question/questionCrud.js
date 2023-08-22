import axios from "axios";
import { API_URL } from "../../../../API_URL";
export const question_URL = API_URL + "question/";

export function findAllquestions() {
  return axios.get(question_URL + "all");
}

export function createQuestion(que) {
  return axios.post(question_URL + "create", que);
}

export function getquestionByID(id) {
  return axios.get(`${question_URL}${id}`);
}

export function findQuestions(queryParams) {
  return axios.get(`${question_URL}`, { params: queryParams });
}

export function updateQuestion(queRes) {
  let { question_title, services } = queRes;
  return axios.put(`${question_URL}edit/${queRes._id}`, {
    question_title,
    services
  });
}

export function deleteQuestion(id) {
  return axios.delete(`${question_URL}${id}`);
}

export function acitivateQuestion(id) {
  return axios.put(`${question_URL}active/${id}`);
}
