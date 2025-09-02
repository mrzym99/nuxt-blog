import defineCustomRules from '~/utils/validate';
import { defineRule, configure } from 'vee-validate';
import { required } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import zh_CN from '@vee-validate/i18n/dist/locale/zh_CN.json';

export default defineNuxtPlugin(() => {
  // 按需加入规则
  defineRule('required', required);
  defineCustomRules();
  // vee-validate 国际化
  localize('zh_CN', zh_CN);

  // 配置 vee-validate
  configure({
    generateMessage: localize({
      zh_CN,
    }),
  });
});
