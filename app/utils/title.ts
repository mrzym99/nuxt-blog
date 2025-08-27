const titleMap: Record<string, string> = {
  '/': '小张的博客 | Home',
  '/about': '小张的博客 | About Me',
  '/login/pwd-login': '小张的博客 | Login',
  '/login/reset-pwd': '小张的博客 | Reset Password',
  '/login/register': '小张的博客 | Register',
  '/login/code-login': '小张的博客 | Code Login',
  '/login/github-login': '小张的博客 | Github Login',
};

export function getTitle(path: string) {
  if (path.includes('/archive')) {
    return '小张的博客 | Archive';
  } else if (path.includes('/posts')) {
    return undefined;
  } else if (path.includes('/user-center')) {
    return '小张的博客 | User Center';
  }
  return titleMap[path] ?? '小张的博客';
}
