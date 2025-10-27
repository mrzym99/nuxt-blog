import type { IPagination } from '~/types';
import type { MessageForm } from '~/types/form/message';
import type { IMessage, MessageType } from '~/types/message';
import type { IMessageQuery } from '~/types/query';
import { $http } from '~/utils/request';

// 获取留言列表
export const getMessages = (params?: IMessageQuery) =>
  $http<IPagination<IMessage>>({
    method: 'get',
    url: '/blog/message/list',
    params,
  });

// 创建留言
export const postMessage = (data?: MessageForm) =>
  $http({
    method: 'post',
    url: '/blog/message/create',
    data,
  });

// 获取留言详情
export const getMessageInfo = (id: number) =>
  $http<IMessage>({
    method: 'get',
    url: '/blog/message/info/' + id,
  });

export const putUpdateMessage = (id: number, data?: MessageForm) =>
  $http({
    method: 'put',
    url: '/blog/message/update/' + id,
    data,
  });

export const getMessageTypes = () =>
  $http<Array<MessageType>>({
    method: 'get',
    url: '/blog/message/types',
  });
