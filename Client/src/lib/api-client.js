import axios from "axios";
import { HOST_URL } from "../utiles/constant.js";

export const apiClient = axios.create({
    baseURL: HOST_URL,
});


