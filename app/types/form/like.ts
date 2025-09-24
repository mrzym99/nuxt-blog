import type { LikeEnum } from '~/enum';

export type LikeForm = {
  userId?: number;
  targetId: number;
  type: LikeEnum;
};

