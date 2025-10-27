import type { UserDetail } from '../user';

export type MessageForm = {
  id?: number;
  type: string;
  content: string;
  user?: UserDetail | null;
  nickName?: string;
};
