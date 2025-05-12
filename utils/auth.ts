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

export function setRefreshToken(token: string) {
  localStorage.setItem(`${appName}-refreshToken`, token);
}

export function getRefreshToken() {
  return localStorage.getItem(`${appName}-refreshToken`);
}

export function removeRefreshToken() {
  return localStorage.removeItem(`${appName}-refreshToken`);
}
