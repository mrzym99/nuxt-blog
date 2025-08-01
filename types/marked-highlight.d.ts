declare module 'marked-highlight' {
  import { Marked } from 'marked';

  interface Options {
    langPrefix?: string;
    highlight?(code: string, lang: string): string;
  }

  function use(options: Options): void;

  export default use;
}
