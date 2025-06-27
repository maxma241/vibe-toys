<script setup lang="ts">
import Game from './components/Game.vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="w-screen h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
    <button @click="toggleDark()" class="absolute top-4 right-4 px-4 py-2 bg-secondary text-white rounded">
      {{ isDark ? 'Light' : 'Dark' }} Mode
    </button>
    <Game />
  </div>
</template>
