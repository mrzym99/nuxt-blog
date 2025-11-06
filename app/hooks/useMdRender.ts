import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import { uuid } from '~/utils/tool';
export function useMdRender() {
  let baseRenderer: Renderer | null = null;

  function init() {
    baseRenderer = new marked.Renderer();
    (baseRenderer.heading as any) = (text: any) => {
      const { depth, text: textContent } = text;
      const id = uuid();
      return `<h${depth} id="${id}">${textContent}</h${depth}>`;
    };

    baseRenderer.image = ({ href, title, text }) => {
      return `<a href="${href}" target="_blank"><img src="${href}" alt="${text}" title="${title}"></a>`;
    };

    baseRenderer.code = function ({ text, lang }) {
      const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'html';
      try {
        const highlighted = hljs.highlight(text, { language: validLanguage }).value;
        return `<pre><button data-code="${encodeURIComponent(text)}" class="md-code-copy-button">copy</button><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
      } catch (e) {
        // 如果高亮失败，返回原始代码
        return `<pre><button data-code="${encodeURIComponent(text)}" class="md-code-copy-button">copy</button><code class="hljs language-${validLanguage}">${text}</code></pre>`;
      }
    };

    hljs.configure({
      ignoreUnescapedHTML: true,
    });

    // 一次性全局配置
    marked.setOptions({
      renderer: baseRenderer,
      gfm: true,
      breaks: true,
    });
  }

  // 防止多次初始化
  !baseRenderer && init();

  onMounted(async () => {
    // @ts-ignore
    if (!window.hljs) {
      // @ts-ignore
      window.hljs = hljs;
      await import('highlightjs-line-numbers.js');
    }
    // @ts-ignore
    hljs.initLineNumbersOnLoad();
  });

  return {
    marked,
  };
}
