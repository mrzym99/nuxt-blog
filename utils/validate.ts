import { defineRule } from 'vee-validate';
import { REG_USER_NAME, REG_PWD } from '~/assets/constant';

const defineCustomeRules = () => {
  defineRule('username', (value: string) => {
    if (!value) {
      return '请输入用户名';
    }
    if (!REG_USER_NAME.test(value)) {
      return '用户名格式不正确，邮箱或6-18位字符，包含字母、数字';
    }
    return true;
  });

  defineRule('password', (value: string) => {
    if (!value) {
      return '请输入密码';
    }
    if (!REG_PWD.test(value)) {
      return '密码格式不正确，6-18位字符，包含字母、数字、特殊字符';
    }
    return true;
  });
};

export default defineCustomeRules;
