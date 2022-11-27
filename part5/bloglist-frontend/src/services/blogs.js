import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  console.log(token);
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: `${token}` },
  };
  console.log(newBlog);
  const request = axios.post(baseUrl, newBlog, config);
  const response = await request;
  console.log(response);
};

export default { getAll, setToken, createBlog };
