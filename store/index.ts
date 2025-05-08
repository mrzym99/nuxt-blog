import { defineStore } from 'pinia';
import type { IArticle, IUser } from '~/types/index';

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
    user: null as IUser | null,
  }),
  getters: {
    getUser: state => state.user,
  },
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
  },
});
