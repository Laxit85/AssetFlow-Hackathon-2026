import axios from "axios";

// Single shared axios instance — every page imports this instead of
// creating its own, so the base URL only ever needs to change in one place.
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;
