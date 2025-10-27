import type { LikeEnum } from '~/enum';
import { getIsLike, getLikeCount, postCancelLike, postLike } from '~/api';

export function useLike() {
  /* 数据结构
   * map => { "ARTICLE-1": { count: 12, liked: false } }
   */
  const map = ref<Record<string, { count: number; liked: boolean }>>({});

  async function checkIsLike(targetId: number, type: LikeEnum, userId?: number) {
    const res = await getIsLike({
      userId,
      targetId,
      type,
    });
    return !!res.data;
  }

  async function handleGetLikeCount(targetId: number, type: LikeEnum) {
    const res = await getLikeCount({
      targetId,
      type,
    });
    return res.data ?? 0;
  }

  // 初始化 or 拉最新
  async function load(key: string, userId?: number) {
    if (map.value[key]) return; // 已加载过不再请求
    const [type, id] = key.split('-');
    const liked = await checkIsLike(Number(id), type as LikeEnum, userId);
    const count = await handleGetLikeCount(Number(id), type as LikeEnum);
    map.value[key] = { count, liked };
  }

  // 点赞 / 取消
  async function toggle(key: string, userId?: number) {
    const meta = map.value[key] || { count: 0, liked: false };
    await handleLike(key, meta.liked, userId);
  }

  async function handleLike(key: string, liked: boolean, userId?: number) {
    const [type, id] = key.split('-') as [LikeEnum, string];

    if (liked) {
      const res = await postCancelLike({
        userId,
        targetId: Number(id),
        type,
      });
      if (res.code === 200) {
        if (map.value[key]) {
          map.value[key].count -= 1;
          map.value[key].liked = false;
        }
      }
    } else {
      const res = await postLike({
        userId,
        targetId: Number(id),
        type,
      });
      if (res.code === 200) {
        if (map.value[key]) {
          map.value[key].count += 1;
          map.value[key].liked = true;
        }
      }
    }
  }

  return { map, load, toggle };
}
