import { useFetch } from '#app';
import { createError } from '#app';
import type { IApiResponse, IHttpOptions } from '~/types';
import { $fetch } from 'ofetch';
import { getToken } from '~/utils/auth';
import { useUserStore } from '~/store';

let $toast: any;

export function initToast(toast: any) {
  $toast = toast;
}

function getAuthorization() {
  if (typeof window !== 'undefined') {
    const token = getToken();
    return `Bearer ${token}`;
  }
  return null;
}

async function http<T = any>(options: IHttpOptions): Promise<IApiResponse<T>> {
  const { url, method, params, data, options: config } = options;
  const baseURL = import.meta.env.VITE_API_BASE || '/api';

  const token = getAuthorization();
  config &&
    Object.assign(config, {
      headers: {
        Authorization: token,
      },
    });

  const { data: result }: any = await useFetch(baseURL + url, {
    method: method,
    onRequest: ({ options }) => {
      options.body = data;
      options.query = params;
      options.timeout = 10000;
      Object.assign(options, config);
    },
    onResponse: async ({ response }) => {
      // console.log('response=', response._data);
      const res = response._data as IApiResponse<T>;
      const code = Number(res.code);
      if (code !== Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
        throw createError({
          statusCode: response?._data.code,
          statusMessage: response?._data.message,
        });
      }

      return response;
    },
    onRequestError({ request, options, error }) {
      // 处理请求错误
      console.warn('request error', error);
    },
    onResponseError({ request, response, options }) {
      // 处理响应错误
      // console.warn('response error', response);
      throw createError({ statusCode: response.status, statusMessage: response.statusText });
    },
  });

  return result.value;
}

async function $http<T = any>(options: IHttpOptions): Promise<IApiResponse<T>> {
  const { url, method, params, data, options: config } = options;
  const baseURL = import.meta.env.VITE_API_BASE || '/api';

  const token = getAuthorization();
  config &&
    Object.assign(config, {
      headers: {
        Authorization: token,
      },
    });

  const res = await $fetch(baseURL + url, {
    method: method,
    onRequest: ({ options }) => {
      options.body = data;
      options.query = params;
      options.timeout = 10000;
      Object.assign(options, config);
    },
    onResponse: ({ response }) => {
      // console.log('response=', response._data);
      const res = response._data as IApiResponse<T>;
      const code = Number(res.code);
      if (code !== Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
        throw createError({
          statusCode: response?._data.code,
          statusMessage: response?._data.message,
        });
      }
    },
    onRequestError: error => {
      console.log(error);
    },
    onResponseError: error => {
      const code = Number(error.response._data.code);
      const expiredCodes = [1001];
      const logoutCodes = [1000];
      if (expiredCodes.includes(code)) {
        // const success = await handleRefreshToken();
        // if (success) {
        //   const authorization = getAuthorization();
        //   Object.assign(response.config.headers, { Authorization: authorization });
        //   return service.request(response.config) as Promise<AxiosResponse>;
        // } else {
        //   removeToken();
        //   useUserStore().removeUser();
        useUserStore().removeUser();
        $toast.error('登录状态已过期，请重新登录');
        // }
      } else if (logoutCodes.includes(code)) {
        useUserStore().logout();
        $toast.error('登录状态已过期，请重新登录');
      } else {
        // 处理其他状态码
        $toast.error(res.message || '请求失败');
      }
    },
  });

  return res;
}

export { http, $http };
