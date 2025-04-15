import axios from 'axios';

// Create an instance of axios with the base URL
const apiClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
});

export default apiClient;