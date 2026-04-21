import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export const sendAnswer = (data) => API.post("/interview", data);
export const getReport = (data) => API.post("/final-report", data);