import { defineStore } from 'pinia';

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
  hydrate(state, initialState) {
    // Manually hydrate with safe objects
    state.currentArticle = initialState?.currentArticle ?? null;
  },
});
