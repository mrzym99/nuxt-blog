import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import type { IApiResponse } from '~/types';
import { getToken, handleRefreshToken, removeToken } from '~/utils/auth';
import { useUserStore } from '~/store';

let $toast: any;

export function initToast(toast: any) {
  $toast = toast;
}

export function getAuthorization() {
  if (typeof window !== 'undefined') {
    const token = getToken();
    return `Bearer ${token}`;
  }

  return null;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api', // API的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在请求发送之前做一些处理，例如添加token
    config.headers.Authorization = getAuthorization();
    return config;
  },
  (error: Error) => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 对响应数据做处理
    const res = response.data;
    // 这里可以根据后端返回的状态码做相应的处理

    const code = res.code;

    if (code === Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
      return res;
    }
    const expiredCodes = [1001];
    const logoutCodes = [1000];
    if (expiredCodes.includes(code)) {
      const success = await handleRefreshToken();
      if (success) {
        const authorization = getAuthorization();
        Object.assign(response.config.headers, { Authorization: authorization });
        return service.request(response.config) as Promise<AxiosResponse>;
      } else {
        removeToken();
        useUserStore().removeUser();
        $toast.error('登录状态已过期，请重新登录');
      }
    } else if (logoutCodes.includes(code)) {
      useUserStore().logout();
      $toast.error('登录状态已过期，请重新登录');
    } else {
      // 处理其他状态码
      $toast.error(res.message || '请求失败');
    }
    console.error('响应错误:', res.message);
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error: AxiosError) => {
    // 处理响应错误
    console.error('响应错误:', error);
    const res = error.response?.data as any;
    const status = error.status;
    switch (status) {
      case 401:
        useUserStore().resetStore();
        break;
      default:
        // 处理其他错误
        $toast.error(res.message || '请求失败');
        break;
    }

    return Promise.reject(error);
  }
);

// 封装GET请求
export function get<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<IApiResponse<T>> {
  return service.get(url, { params, ...config });
}

// 封装POST请求
export function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<IApiResponse<T>> {
  return service.post(url, data, config);
}

// 封装PUT请求
export function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<IApiResponse<T>> {
  return service.put(url, data, config);
}

// 封装DELETE请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
  return service.delete(url, config);
}

// 导出axios实例
export default service;
