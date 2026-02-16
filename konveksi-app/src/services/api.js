import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? 'https://konveksi-backend.vercel.app/api'
  : 'http://localhost:4000/api';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default API;