import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://35.239.63.216/api',
  // baseURL: 'http://localhost:3000/api',
});

export default instance;
