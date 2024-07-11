import axios from 'axios';

export default axios.create({
    baseURL: "http://10.50.2.220:8000",
    withCredentials: true
});