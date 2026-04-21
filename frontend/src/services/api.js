import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const sendAnswer = (data) => API.post("/interview", data);
export const getReport = (data) => API.post("/final-report", data);