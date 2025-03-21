import axios from 'axios';
import Constants from 'expo-constants';
import { getItem, removeItem} from '@/utils/asyncStorage';
import {AUTH_KEY, type LoginData } from '@/modules/auth/types/auth';

const axiosClient = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl || 'https://api.example.com',
    method: 'get',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

axiosClient.defaults.timeout = 20000;

axiosClient.interceptors.request.use(async (config) => {
    const data = await getItem<LoginData>(AUTH_KEY);
    config.headers.Authorization = data ? `Bearer ${data.token}` : '';
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { status } = error.response || {};
        if (status === 401 || status === 403) {
            // Xóa token và điều hướng về màn hình đăng nhập
            await removeItem(AUTH_KEY);


            return Promise.reject(
                status === 401
                    ? 'Phiên đăng nhập hết hạn'
                    : 'Bạn không có quyền truy cập'
            );
        }
        return Promise.reject(error);
    }
);

export default axiosClient;