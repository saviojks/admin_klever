import axios from 'axios';
const KleverApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})
KleverApi.interceptors.request.use(async config => {
    const token = 'token_here'
    if (token) {
        config.headers.authorization = token;
    }
    return config;
});

export default KleverApi;