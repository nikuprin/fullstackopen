import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const getAll = () => {
  return axios.get(baseUrl);
};

export const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

export const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};
