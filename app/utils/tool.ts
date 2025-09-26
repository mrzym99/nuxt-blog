import dayjs from 'dayjs';

// 格式化日期
export const formatDate = (time?: Date | null) => {
  return time && dayjs(time).format('M/D/YYYY');
};

// 格式统计信息数字
export const formatNumber = (count?: number) => {
  if (!count) return null;
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w+`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`;
  }
  return count;
};

// 格式化阅读时长
export const formatDuration = (timestamp: number): string => {
  const minute = 60 * 1000;
  const hour = 60 * minute;

  if (timestamp < minute) {
    return '小于一分钟';
  } else if (timestamp < hour) {
    const minutes = Math.floor(timestamp / minute);
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(timestamp / hour);
    return `${hours}小时`;
  }
};

// 获取字符串的开始和结束位置
export const strToStartEnd = (str: string, keyword: string) => {
  const length = str.length;
  const index = str.indexOf(keyword);
  if (index !== -1) {
    return {
      start: str.substring(0, index),
      keyword,
      end: str.substring(index + keyword.length, index + length),
    };
  }

  return {
    start: str.substring(0, length),
    keyword: '',
    end: '',
  };
};

// 计算时间差
export const diffNowWord = (date?: Date | null | undefined) => {
  if (!date) return null;
  const now = new Date().getTime();
  const diff = now - new Date(date!).getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;

  return formatDate(date);
};

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
