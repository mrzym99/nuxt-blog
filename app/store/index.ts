import { defineStore } from 'pinia';
import { getMentionList, getUserInfo, postCodeLoginForm, postLogin, postThirdLogin } from '~/api';
import type { CodeLoginForm, PwdLoginForm, ThirdRegisterForm } from '~/types/form';
import type { IArticle, IMentionUser, UserDetail } from '~/types/index';
import { setToken, removeToken } from '~/utils/auth';

export const useArticleStore = defineStore('blogArticle', {
  state: () => ({
    currentArticle: null as IArticle | null,
    refresh: false as boolean,
    hasCatalogue: false as boolean,
  }),
  getters: {
    getCurrentArticle: state => state.currentArticle,
    getArticleHasCover: state => state.currentArticle?.cover,
    getRefresh: state => state.refresh,
    getHasCatalog: state => state.hasCatalogue,
  },
  actions: {
    setCurrentArticle(article: IArticle) {
      this.currentArticle = article;
    },
    setRefresh(refresh: boolean) {
      this.refresh = refresh;
    },
    setHasCatalog(hasCatalogue: boolean) {
      this.hasCatalogue = hasCatalogue;
    },
  },
});

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserDetail | null,
    mentionList: [] as Array<IMentionUser>,
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
            getMentionList().then(res => {
              this.mentionList = res.data;
            });
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
    removeUser() {
      this.user = null;
    },
    async pwdLogin(dto: PwdLoginForm) {
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
    codeLogin(dto: CodeLoginForm) {
      return new Promise((resolve, reject) => {
        postCodeLoginForm(dto)
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
    thirdLogin(dto: ThirdRegisterForm) {
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
