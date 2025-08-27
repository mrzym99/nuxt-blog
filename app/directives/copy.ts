import { useNuxtApp } from '#app';

export const copy = {
  mounted(el: any, binding: any) {
    const { $toast } = useNuxtApp();
    // 复制处理函数
    const copyToClipboard = async () => {
      try {
        const textToCopy = binding.value || el.textContent?.trim();
        if (!textToCopy) return;

        window && window.navigator && (await window.navigator.clipboard.writeText(textToCopy));

        $toast.success('已成功复制到剪切板');
      } catch (err) {
        // 错误处理
        $toast.error('复制失败');
        console.error('复制失败:', err);
      }
    };
    el.addEventListener('click', copyToClipboard);
    el.handler = copyToClipboard;
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.handler);
  },
};
