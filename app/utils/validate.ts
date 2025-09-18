import { REG_USER_NAME, REG_PWD, REG_CODE_FOUR } from '~/constants';
import { defineRule } from 'vee-validate';
const defineCustomRules = () => {
  defineRule('username', (value: string) => {
    if (value && !REG_USER_NAME.test(value)) {
      return '用户名格式不正确，邮箱或6-18位字符，包含字母、数字';
    }
    return true;
  });

  defineRule('password', (value: string) => {
    if (value && !REG_PWD.test(value)) {
      return '密码格式不正确，6-18位字符，包含字母、数字、特殊字符';
    }
    return true;
  });

  defineRule('code', (value: string) => {
    if (value && !REG_CODE_FOUR.test(value)) {
      return '验证码格式不正确，4位数字';
    }
    return true;
  });

  defineRule('confirmPassword', (value: string, [target]: [string]) => {
    if (value && value !== target) {
      return '密码和确认密码不一致';
    }

    if (!REG_PWD.test(value)) {
      return '密码格式不正确，6-18位字符，包含字母、数字、特殊字符';
    }

    return true;
  });

  defineRule('newPassword', (value: string, [target]: [string]) => {
    if (value && value === target) {
      return '新密码不能和旧密码一样';
    }

    if (!REG_PWD.test(value)) {
      return '密码格式不正确，6-18位字符，包含字母、数字、特殊字符';
    }

    return true;
  });

  defineRule('userConfirmPassword', (value: string, [target]: [string]) => {
    if (value && value !== target) {
      return '新密码和确认密码不一致';
    }

    if (!REG_PWD.test(value)) {
      return '密码格式不正确，6-18位字符，包含字母、数字、特殊字符';
    }

    return true;
  });
};

export default defineCustomRules;
