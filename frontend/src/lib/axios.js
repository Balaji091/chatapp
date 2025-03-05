import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.NODE_ENV=development
  === "development" ? "http://localhost:5000/" : "/api",
  withCredentials: true,
});
