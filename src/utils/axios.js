import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',  // 设置你后端的地址和公共路径
    timeout: 5000
});

export default instance;