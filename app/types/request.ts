import type { HttpMethodEnum } from '~/enum';
import type { Recordable, ValueOf } from './base';

export type HttpMethod = ValueOf<HttpMethodEnum>;

export interface IHttpOptions {
  method: HttpMethod;
  url: string;
  params?: Recordable;
  data?: Recordable;
  options?: Recordable;
}

export interface IApiResponse<T extends any> {
  data: T;
  code: number;
  message?: string;
}

export interface IPagination<T extends any> {
  currentPage: number;
  pageSize: number;
  total: number;
  list: Array<T>;
  allTotal?: number;
}
