import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { IApiResponse } from '~/types';
import { getToken } from '~/utils/auth';

let $toast: any;

export function initToast(toast: any) {
  $toast = toast;
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
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
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
  (response: AxiosResponse) => {
    // 对响应数据做处理
    const res = response.data;
    // 这里可以根据后端返回的状态码做相应的处理

    if (res.code === Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
      return res;
    }
    // 处理其他状态码
    console.error('响应错误:', res.message);
    $toast.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error: AxiosError) => {
    // 处理响应错误
    console.error('响应错误:', error);
    $toast.error((error.response?.data as any).message || '请求失败');
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get<T>(url: string, params?: any): Promise<IApiResponse<T>> {
  return service.get(url, { params });
}

// 封装POST请求
export function post<T>(url: string, data?: any): Promise<IApiResponse<T>> {
  return service.post(url, data);
}

// 封装PUT请求
export function put<T>(url: string, data?: any): Promise<IApiResponse<T>> {
  return service.put(url, data);
}

// 封装DELETE请求
export function del<T>(url: string): Promise<IApiResponse<T>> {
  return service.delete(url);
}

// 导出axios实例
export default service;
