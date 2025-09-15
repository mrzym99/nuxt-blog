import { defineStore } from 'pinia';
import {
  getUserInfo,
  postCodeLogin,
  postLogin,
  postThirdLogin,
  type CodeLogin,
  type PwdLogin,
  type ThirdRegister,
} from '~/api';
import type { IArticle, UserDetail } from '~/types/index';
import { setToken, removeToken } from '~/utils/auth';

export const useArticleStore = defineStore('blogArticle', {
  state: () => ({
    currentArticle: null as IArticle | null,
    refresh: false as boolean,
  }),
  getters: {
    getCurrentArticle: state => state.currentArticle,
    getArticleHasCover: state => state.currentArticle?.cover,
    getRefresh: state => state.refresh,
  },
  actions: {
    setCurrentArticle(article: IArticle) {
      this.currentArticle = article;
    },
    setRefresh(refresh: boolean) {
      this.refresh = refresh;
    },
  },
});

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDetail | null,
    ready: false,
  }),
  getters: {
    getUser: state => state.user,
  },
  actions: {
    setUser() {
      return new Promise<void>(resolve => {
        getUserInfo()
          .then(res => {
            this.user = res.data;
            resolve();
          })
          .catch(() => {
            this.user = null;
            resolve();
          });
      });
    },
    async initUserInfo() {
      await this.setUser();
    },
    setReady() {
      this.ready = true;
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
      this.resetStore();
    },
    resetStore() {
      removeToken();
      this.removeUser();
    },
  },
});
