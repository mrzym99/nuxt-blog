import type { DirectiveBinding } from 'vue';

export const clickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    document.addEventListener('click', e => {
      if (!el.contains(e.target as Node)) {
        binding.value(e);
      }
    });
  },
  unmounted(el: HTMLElement & { handler?: (e: Event) => void }) {
    if (el.handler) {
      document.removeEventListener('click', el.handler);
      delete el.handler;
    }
  },
};
