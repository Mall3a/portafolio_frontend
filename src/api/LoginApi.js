import axios from "axios";

const API_URL = "http://localhost:8080/api/";

export const login = (user, password) => {
  return axios.get(API_URL + "login?user=" + user);
};
