import { postRefreshToken } from '~/api';

const appName = import.meta.env.VITE_APP_NAME;
export function setToken(token: string) {
  localStorage.setItem(`${appName}-token`, token);
}

export function getToken() {
  return localStorage.getItem(`${appName}-token`);
}

export function removeToken() {
  return localStorage.removeItem(`${appName}-token`);
}

export async function handleRefreshToken() {
  const token = getToken();
  if (!token) return false;
  const res = await postRefreshToken({
    accessToken: token!,
  });
  if (res.data.access_token) {
    setToken(res.data.access_token);
    return true;
  }

  return false;
}
