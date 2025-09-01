import { useFetch } from '#app';
import { createError } from '#app';
import type { IApiResponse, IHttpOptions } from '~/types';
import { $fetch } from 'ofetch';
import { getToken, handleRefreshToken } from '~/utils/auth';
import { useUserStore } from '~/store';

function getAuthorization() {
  try {
    // 只在客户端环境中访问 localStorage
    if (typeof window !== 'undefined') {
      const token = getToken();
      return `Bearer ${token}`;
    }
    return ''; // 服务端返回空字符串
  } catch (e) {
    console.log(e);
    return '';
  }
}

async function http<T = any>(options: IHttpOptions): Promise<IApiResponse<T>> {
  const { url, method, params, data, options: config = {} } = options;
  const baseURL = import.meta.env.VITE_API_BASE;
  const { $toast } = useNuxtApp();

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
      const res = response._data as IApiResponse<T>;
      const code = Number(res.code);
      if (code !== Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
        const expiredCodes = [1001];
        const logoutCodes = [1000];
        if (expiredCodes.includes(code)) {
          const flag = await handleRefreshToken();
          if (flag) {
            return $fetch(baseURL + url, {
              method: method,
              body: data,
              query: params,
              ...config,
            });
          }
        } else if (logoutCodes.includes(code)) {
          removeToken();
          useUserStore().logout();
          $toast.error('登录状态已过期，请重新登录');
        } else {
          $toast.error(response?._data.message || '请求失败');
          throw createError({
            statusCode: response?._data.code,
            statusMessage: response?._data.message,
          });
        }
      }

      return response;
    },
    onRequestError({ request, options, error }) {
      // 处理请求错误
      $toast.error(error.message || '请求失败');
      throw createError({ statusMessage: error.message });
    },
    onResponseError({ request, response, options }) {
      // 处理响应错误
      $toast.error(response.statusText || '请求失败');
      throw createError({ statusCode: response.status, statusMessage: response.statusText });
    },
  });

  return result.value;
}

async function $http<T = any>(options: IHttpOptions): Promise<IApiResponse<T>> {
  const { url, method, params, data, options: config = {} } = options;
  const baseURL = import.meta.env.VITE_API_BASE;
  const { $toast } = useNuxtApp();

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
    onResponse: async ({ response }) => {
      const res = response._data as IApiResponse<T>;
      const code = Number(res.code);
      if (code !== Number(import.meta.env.VITE_API_SUCCESS_CODE)) {
        const expiredCodes = [1001];
        const logoutCodes = [1000];
        if (expiredCodes.includes(code)) {
          const flag = await handleRefreshToken();
          if (flag) {
            return $fetch(baseURL + url, {
              method: method,
              body: data,
              query: params,
              ...config,
            });
          }
        } else if (logoutCodes.includes(code)) {
          removeToken();
          useUserStore().logout();
          $toast.error('登录状态已过期，请重新登录');
        } else {
          $toast.error(response?._data.message || '请求失败');
          throw createError({
            statusCode: response?._data.code,
            statusMessage: response?._data.message,
          });
        }
      }
    },
    onRequestError: ({ request, options, error }) => {
      $toast.error(error.message || '请求失败');
      throw createError({ statusMessage: error.message });
    },
    onResponseError: ({ request, response, options }) => {
      $toast.error(response.statusText || '请求失败');
      throw createError({ statusCode: response.status, statusMessage: response.statusText });
    },
  });

  return res;
}

export { http, $http };
