import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5232/api'
});

export default axiosInstance;