import type { Recordable } from '~/types';

export const requestAnimationFrameThrottle = (fn: (arg0: Recordable) => void) => {
  let lock: boolean;
  return (e: Recordable) => {
    if (lock) return;
    lock = true;
    requestAnimationFrame(() => {
      fn(e);
      lock = false;
    });
  };
};
