declare module 'marked-highlight' {
  import { Marked } from 'marked';

  interface Options {
    langPrefix?: string;
    highlight?(code: string, lang: string): string;
  }

  function use(options: Options): void;

  export default use;
}

declare module 'quill2-emoji' {}
declare module 'highlightjs-line-numbers.js' {}
