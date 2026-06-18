interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_OPENROUTER_MODEL: string
  readonly VITE_OPENROUTER_BASE_URL: string
  readonly VITE_OPENROUTER_APP_TITLE: string
  readonly VITE_OPENROUTER_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*?component' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg' {
  const content: string
  export default content
}
