import { get, post } from '~/utils/request';
import FormData from 'form-data';

// 获取参数信息
export const getParameter = (key?: string) => get<string>('/system/parameter/value/' + key, {});

// 图片上传
export const uploadImg = (data?: FormData) =>
  post<string>('/tools/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
