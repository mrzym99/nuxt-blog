import type { ViewEnum } from '~/enum';

export type viewForm = {
  targetId: number;
  type: ViewEnum;
  duration: number;
  userId?: number;
};
