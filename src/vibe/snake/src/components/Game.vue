<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDark } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const gridSize = 20
const tileCount = 30

let snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]
let food = { x: 15, y: 15 }
let direction = { x: 0, y: -1 } // Initial direction: up
let score = ref(0)
let isPaused = ref(false)
let isGameOver = ref(false)

const encouragementWords = [
  "太棒了！",
  "繼續加油！",
  "你超強的！",
  "無人能敵！",
  " unstoppable！",
  "vibe is good"
]
const currentEncouragement = ref("")

const isDark = useDark()

const gameLoop = () => {
  if (isPaused.value || isGameOver.value) return

  update()
  draw()
  setTimeout(gameLoop, 200)
}

const update = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkCollision(head)) {
    isGameOver.value = true
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    score.value++
    currentEncouragement.value = encouragementWords[Math.floor(Math.random() * encouragementWords.length)]
    generateFood()
  } else {
    snake.pop()
  }
}

const draw = () => {
  if (!ctx.value) return

  const backgroundColor = isDark.value ? getComputedStyle(document.documentElement).getPropertyValue('--background-dark') : getComputedStyle(document.documentElement).getPropertyValue('--background-light');
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary');

  // Clear canvas
  ctx.value.fillStyle = backgroundColor;
  ctx.value.fillRect(0, 0, canvas.value!.width, canvas.value!.height)

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.value!.fillStyle = index === 0 ? primaryColor : secondaryColor;
    ctx.value!.beginPath();
    const radius = index === 0 ? gridSize / 2 : gridSize / 2 - 1;
    const centerX = segment.x * gridSize + gridSize / 2;
    const centerY = segment.y * gridSize + gridSize / 2;
    ctx.value!.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.value!.fill();

    if (index === 0) {
      // Draw eyes
      ctx.value!.fillStyle = 'white';
      const eyeRadius = 3;
      const eyeOffsetX = direction.x === 0 ? 5 : 0;
      const eyeOffsetY = direction.y === 0 ? 5 : 0;
      ctx.value!.beginPath();
      ctx.value!.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.value!.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
      ctx.value!.fill();
    }
  })

  // Draw food
  ctx.value.fillStyle = 'red'
  ctx.value.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
}

const generateFood = () => {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  }

  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    generateFood()
  }
}

const checkCollision = (head: { x: number, y: number }) => {
  return snake.some(segment => segment.x === head.x && segment.y === head.y)
}

const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault()
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 }
      break
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 }
      break
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 }
      break
    case ' ': // Space to pause/resume
      isPaused.value = !isPaused.value
      if (!isPaused.value) {
        gameLoop()
      }
      break
  }
}

const restartGame = () => {
  snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]
  food = { x: 15, y: 15 }
  direction = { x: 0, y: -1 }
  score.value = 0
  isPaused.value = false
  isGameOver.value = false
  currentEncouragement.value = ""
  gameLoop()
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = gridSize * tileCount
    canvas.value.height = gridSize * tileCount
    ctx.value = canvas.value.getContext('2d')
  }

  window.addEventListener('keydown', handleKeydown)
  gameLoop()
})

watch(isDark, () => {
  draw()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="text-2xl mb-4">{{ currentEncouragement }}</div>
    <canvas ref="canvas" class="border-2 border-gray-500"></canvas>
    <div class="mt-4 text-xl">Score: {{ score }}</div>
    <div v-if="isGameOver" class="absolute flex flex-col items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div class="text-4xl text-white">Game Over</div>
      <button @click="restartGame" class="mt-4 px-4 py-2 bg-primary text-white rounded">Restart</button>
    </div>
    <div class="mt-4">
      <button @click="isPaused = !isPaused" class="px-4 py-2 bg-secondary text-white rounded">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --background-light: #f5f5f5;
  --background-dark: #1a1a1a;
  --primary: #4ade80;
  --secondary: #a78bfa;
}
</style>
