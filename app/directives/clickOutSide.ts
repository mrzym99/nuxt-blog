export const clickOutside = {
  mounted(el: any, binding: any) {
    document.addEventListener('click', e => {
      if (!el.contains(e.target)) {
        binding.value(e);
      }
    });
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.handler);
  },
};
