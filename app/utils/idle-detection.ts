/**
 * 网页空闲检测
 * @param {() => void} start 用户进来以后会重新计时
 * @param {() => void} callback 空闲时执行，即一定时长无操作时触发
 * @param {number} [timeout=15] 时长，默认15s，单位：秒
 * @param {boolean} [immediate=false] 是否立即开始，默认 false
 * @returns
 */
const useIdleDetection = (start: () => void, callback: () => void, timeout = 15) => {
  let pageTimer: any = undefined;
  let beginTime = 0;
  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer);
    pageTimer = undefined;
  };
  const onStartTimer = () => {
    start();
    const currentTime = Date.now();
    if (pageTimer && currentTime - beginTime < 100) {
      return;
    }

    onClearTimer();
    beginTime = currentTime;
    pageTimer = setTimeout(() => {
      callback();
      // console.log('页面停一次');
    }, timeout * 1000);
  };

  const onPageVisibility = () => {
    // 页面显示状态改变时，移除延时器
    onClearTimer();

    if (document.visibilityState === 'visible') {
      const currentTime = Date.now();
      // 页面显示时，计算时间，如果超出限制时间则直接执行回调函数
      if (currentTime - beginTime >= timeout * 1000) {
        callback();
        return;
      }
      // 继续计时
      pageTimer = setTimeout(
        () => {
          callback();
        },
        timeout * 1000 - (currentTime - beginTime)
      );
    }
  };

  const startDetection = () => {
    onStartTimer();
    document.addEventListener('keydown', onStartTimer);
    document.addEventListener('mousemove', onStartTimer);
    document.addEventListener('visibilitychange', onPageVisibility);
  };

  const stopDetection = () => {
    onClearTimer();
    document.removeEventListener('keydown', onStartTimer);
    document.removeEventListener('mousemove', onStartTimer);
    document.removeEventListener('visibilitychange', onPageVisibility);
  };

  const restartDetection = () => {
    onClearTimer();
    onStartTimer();
  };

  return {
    startDetection,
    stopDetection,
    restartDetection,
  };
};

export default useIdleDetection;
