import axios from "axios";
import { HOST_URL } from "../utiles/constant.js";

// `apiClient` is an Axios instance
export const apiClient = axios.create({
    baseURL: HOST_URL,
});


