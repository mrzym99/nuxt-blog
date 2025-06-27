import FormData from 'form-data';
import { $http } from '~/utils/request';

// 获取参数信息
export const getParameter = (key?: string) =>
  $http<string>({
    method: 'get',
    url: '/system/parameter/value/' + key,
  });

export const uploadImg = (data?: FormData) =>
  $http({
    method: 'post',
    url: '/tools/upload',
    data,
    options: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  });
