import axios from 'axios'

export const API = axios.create({
    baseURL: "http://localhost:3031/",
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
})