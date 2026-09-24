import { Marked, type Tokens } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

const markedInstance = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
  {
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }: Tokens.Code): string {
        const displayLang = lang ? lang.toLowerCase() : 'code'

        return `
<div class="markdown-code-block">
  <div class="markdown-code-header">
    <span class="markdown-code-lang">${displayLang}</span>
    <button type="button" class="markdown-copy-button" aria-label="Скопировать код" title="Скопировать код">
      <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span class="copy-text">Копировать</span>
    </button>
  </div>
  <pre><code class="hljs language-${lang || 'plaintext'}">${text}</code></pre>
</div>`
      },
      link({ href, title, text }: Tokens.Link): string {
        const titleAttr = title ? ` title="${title}"` : ''
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
      },
    },
  },
)

function autoCloseCodeBlocks(content: string): string {
  const matches = content.match(/```/g)
  if (matches && matches.length % 2 !== 0) {
    return content + '\n```'
  }
  return content
}

function processThinkingTags(content: string): string {
  // Проверяем, продолжается ли еще процесс рассуждения:
  // Если тег <think> уже открыт, но закрывающего </think> еще нет в исходном тексте
  const isStillThinking = content.includes('<think>') && !content.includes('</think>')

  let normalized = content
  if (isStillThinking) {
    normalized += '\n</think>'
  }

  return normalized.replace(/<think>([\s\S]*?)<\/think>/gi, (_, thought) => {
    const openAttr = isStillThinking ? ' open' : ''
    const thinkingClass = isStillThinking ? ' is-thinking' : ''
    const statusText = isStillThinking ? 'Ход мыслей (модель думает...)' : 'Ход мыслей'

    return `<details class="markdown-thought${thinkingClass}"${openAttr}><summary><span class="markdown-thought-summary">${statusText}</span></summary><div class="markdown-thought-content">${thought.trim()}</div></details>`
  })
}

export function parseMarkdown(rawContent?: string | null): string {
  if (!rawContent) return ''

  let processed = autoCloseCodeBlocks(rawContent)
  processed = processThinkingTags(processed)

  const rawHtml = markedInstance.parse(processed) as string

  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['button', 'svg', 'path', 'rect', 'span', 'details', 'summary'],
    ADD_ATTR: [
      'open',
      'target',
      'rel',
      'class',
      'type',
      'aria-label',
      'title',
      'viewBox',
      'fill',
      'stroke',
      'stroke-width',
      'stroke-linecap',
      'stroke-linejoin',
      'd',
      'width',
      'height',
      'rx',
      'ry',
      'x',
      'y',
    ],
  })
}
