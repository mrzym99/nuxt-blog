import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

export function useMdRender() {
  let baseRenderer: Renderer | null = null;

  function init() {
    baseRenderer = new marked.Renderer();
    (baseRenderer.heading as any) = (text: any) => {
      const { depth, text: textContent } = text;
      const id = textContent;
      return `<h${depth} id="${id}">${textContent}</h${depth}>`;
    };

    baseRenderer.code = function ({ text, lang }) {
      const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'xml';
      try {
        const highlighted = hljs.highlight(text, { language: validLanguage }).value;
        return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
      } catch (e) {
        // 如果高亮失败，返回原始代码
        return `<pre><code class="hljs language-${validLanguage}">${text}</code></pre>`;
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

  return {
    marked,
  };
}
