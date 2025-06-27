
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      'primary': '#4ade80',
      'secondary': '#a78bfa',
      'background-light': '#f5f5f5',
      'background-dark': '#1a1a1a',
      'text-light': '#1a1a1a',
      'text-dark': '#f5f5f5',
    }
  }
})
