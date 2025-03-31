import { defineStore } from "pinia";

export const useArticleStore = defineStore("blogArticle", {
  state: () => ({
    currentArticle: null as IArticle | null,
  }),
  getters: {
    getCurrentArticle: (state) => state.currentArticle,
    getArticleHasCover: (state) => state.currentArticle?.cover,
  },
  actions: {
    setCurrentArticle(article: IArticle) {
      this.currentArticle = article;
    },
  },
});
