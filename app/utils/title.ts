import { menuList } from '~/router';

const title = import.meta.env.VITE_APP_NAME;
function getMenuName(path: string) {
  const item = menuList.filter(v => v.path).find(menu => path === menu.path);
  return item?.name;
}

const titleMap: Record<string, string> = {
  '/login/pwd-login': '登录',
  '/login/reset-pwd': '重置密码',
  '/login/register': '注册',
  '/login/code-login': '验证码登录',
  '/login/github-login': 'Github 登录',
};

export function getTitle(path: string) {
  const name = getMenuName(path);
  if (name) {
    return `${title} | ${name}`;
  }
  if (path.includes('/posts')) {
    return undefined;
  } else if (path.includes('/user-center')) {
    return `${title} | 个人中心`;
  }
  return titleMap[path] ? `${title} | ${titleMap[path]}` : title;
}
