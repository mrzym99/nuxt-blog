import { defineStore } from 'pinia';
import {
  getLogout,
  getUserInfo,
  postCodeLogin,
  postLogin,
  postThirdLogin,
  type CodeLogin,
  type PwdLogin,
  type ThirdRegister,
} from '~/api';
import type { IArticle, Theme, UserDetail } from '~/types/index';
import { setToken, removeToken } from '~/utils/auth';

export const useArticleStore = defineStore('blogArticle', {
  state: () => ({
    currentArticle: null as IArticle | null,
  }),
  getters: {
    getCurrentArticle: state => state.currentArticle,
    getArticleHasCover: state => state.currentArticle?.cover,
  },
  actions: {
    setCurrentArticle(article: IArticle) {
      this.currentArticle = article;
    },
  },
});

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDetail | null,
  }),
  getters: {
    getUser: state => state.user,
  },
  actions: {
    setUser() {
      getUserInfo().then(res => {
        this.user = res.data;
      });
    },
    removeUser() {
      this.user = null;
    },
    async pwdLogin(dto: PwdLogin) {
      return new Promise((resolve, reject) => {
        postLogin(dto)
          .then(res => {
            const { access_token } = res.data;
            setToken(access_token);
            this.setUser();
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    codeLogin(dto: CodeLogin) {
      return new Promise((resolve, reject) => {
        postCodeLogin(dto)
          .then(res => {
            const { access_token } = res.data;
            setToken(access_token);
            this.setUser();
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    thirdLogin(dto: ThirdRegister) {
      return new Promise((resolve, reject) => {
        postThirdLogin(dto)
          .then(res => {
            const { access_token } = res.data;
            setToken(access_token);
            this.setUser();
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    logout() {
      getLogout().then(() => {
        removeToken();
        this.removeUser();
      });
    },
    resetStore() {
      removeToken();
      this.removeUser();
    },
  },
});

export const useBlogStore = defineStore('blog', {
  state: () => ({
    theme: 'default' as Theme,
  }),
  getters: {
    getTheme: state => state.theme,
  },
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
    },
  },
});
