import type { MessageTypeEnum } from '~/enum';
import type { baseModel } from './base';
import type { IUser } from './user';

export interface IMessage extends baseModel {
  content: string;
  type: MessageTypeEnum;
  nickName?: string;
  user?: IUser;
  ipAddress?: string;
}

export type MessageType = {
  label: string;
  value: MessageTypeEnum;
};
