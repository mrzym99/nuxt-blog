// 格式化日期
export const formatDate = (time?: Date | null) => {
  return time && new Date(time).toLocaleDateString();
};

export const formatNumber = (count?: number) => {
  if (!count) return null;
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w+`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+`;
  }
  return count;
};

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
