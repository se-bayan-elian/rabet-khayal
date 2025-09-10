
import { API_BASE_URL } from "@/config/constant";
import axios from "axios";

export const axiosAuthClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
