<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4">
    <Navbar v-if="!gameStarted" />
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h1 class="text-3xl font-bold mb-4 text-center text-gray-800">Number Guessing Game</h1>
      
      <div v-if="!gameStarted" class="text-center">
        <input 
          v-model="playerName" 
          type="text" 
          placeholder="Enter your name" 
          class="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
        <p class="w-full flex">Difficulty:</p>
        <select 
          v-model="difficulty" 
          class="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="easy">Easy (1-50, 7 trials)</option>
          <option value="medium">Medium (1-100, 5 trials)</option>
          <option value="hard">Hard (1-200, 3 trials)</option>
        </select>
        <button 
          @click="startGame" 
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
      
      <div v-else>
        <p class="mb-2 text-gray-700">Hello, {{ playerName }}!</p>
        <p class="mb-2 text-gray-700">Guess a number between {{ minNumber }} and {{ maxNumber }}</p>
        <div class="mb-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            class="h-2.5 rounded-full transition-all duration-500 ease-out" 
            :class="progressBarColor"
            :style="{ width: `${(trialsLeft / maxTrials) * 100}%` }"
          ></div>
        </div>
        <p class="mb-2 text-gray-700">Trials left: {{ trialsLeft }}</p>
        <input 
          v-model.number="guess" 
          type="number" 
          class="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          :disabled="gameOver"
          placeholder="Enter your guess"
          :class="{ 'shake-animation': shakeInput }"
          @animationend="shakeInput = false"
        >
        <button 
          @click="makeGuess" 
          class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 transition duration-300 ease-in-out transform hover:scale-105"
          :disabled="gameOver || !guess"
        >
          Make Guess
        </button>
        <button 
          @click="getHint" 
          class="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 transition duration-300 ease-in-out transform hover:scale-105"
          :disabled="gameOver || hintsUsed >= maxHints"
        >
          Get Hint ({{ maxHints - hintsUsed }} left)
        </button>
        <p :class="messageClass" class="text-lg font-semibold mb-2">{{ message }}</p>
        <div v-if="gameOver" class="mb-4">
          <p class="font-bold">Your score: {{ score }}</p>
          <p class="font-bold">High score: {{ highScore }}</p>
        </div>
        <button 
          v-if="gameOver" 
          @click="restartGame" 
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Play Again
        </button>
        <button 
          @click="refreshPage" 
          class="w-full mt-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          New Game
        </button>
        
        <div v-if="guessHistory.length > 0" class="mt-4">
          <h2 class="text-xl font-bold mb-2">Guess History</h2>
          <ul class="space-y-1">
            <li v-for="(guessInfo, index) in guessHistory" :key="index" class="flex justify-between">
              <span>{{ guessInfo.guess }}</span>
              <span :class="guessInfo.result === 'correct' ? 'text-green-500' : (guessInfo.result === 'high' ? 'text-red-500' : 'text-blue-500')">
                {{ guessInfo.result === 'correct' ? 'Correct' : (guessInfo.result === 'high' ? 'Too high' : 'Too low') }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import confetti from 'canvas-confetti'
import Navbar from './NavBar.vue'

export default {
  components: {
    Navbar
  },
  setup() {
    const playerName = ref('')
    const difficulty = ref('medium')
    const number = ref(0)
    const guess = ref(null)
    const trialsLeft = ref(5)
    const maxTrials = ref(5)
    const message = ref('')
    const gameStarted = ref(false)
    const gameOver = ref(false)
    const score = ref(0)
    const highScore = ref(0)
    const hintsUsed = ref(0)
    const maxHints = ref(2)
    const shakeInput = ref(false)
    const guessHistory = ref([])

    const minNumber = ref(1)
    const maxNumber = ref(100)

    const difficultySettings = {
      easy: { range: 50, trials: 7 },
      medium: { range: 100, trials: 5 },
      hard: { range: 200, trials: 3 }
    }

    const messageClass = computed(() => {
      if (message.value.includes('correctly')) return 'text-green-500'
      if (message.value.includes('lower')) return 'text-yellow-500'
      if (message.value.includes('higher')) return 'text-yellow-500'
      return 'text-red-500'
    })

    const progressBarColor = computed(() => {
      const percentage = (trialsLeft.value / maxTrials.value) * 100
      if (percentage > 60) return 'bg-green-500'
      if (percentage > 30) return 'bg-yellow-500'
      return 'bg-red-500'
    })

    const startGame = () => {
      const settings = difficultySettings[difficulty.value]
      minNumber.value = 1
      maxNumber.value = settings.range
      number.value = Math.floor(Math.random() * settings.range) + 1
      maxTrials.value = settings.trials
      trialsLeft.value = settings.trials
      gameStarted.value = true
      resetGame()
    }

    const makeGuess = () => {
      let result
      if (guess.value > number.value) {
        message.value = "Guess a little lower."
        result = 'high'
      } else if (guess.value < number.value) {
        message.value = "Guess a little higher."
        result = 'low'
      } else {
        message.value = "You guessed correctly!"
        gameOver.value = true
        result = 'correct'
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 }
        })
        updateScore()
      }

      guessHistory.value.push({ guess: guess.value, result })

      trialsLeft.value--
      if (!gameOver.value) {
        guess.value = null
        shakeInput.value = true
      }

      if (trialsLeft.value === 0 && !gameOver.value) {
        message.value = `Game over! You've exhausted the number of guesses. The answer was ${number.value}.`
        gameOver.value = true
      }
    }

    const getHint = () => {
      if (hintsUsed.value < maxHints.value) {
        const range = Math.abs(number.value - guess.value)
        message.value = `The number is within ${range} of your last guess.`
        hintsUsed.value++
      }
    }

    const updateScore = () => {
      score.value = trialsLeft.value * 10
      if (score.value > highScore.value) {
        highScore.value = score.value
        localStorage.setItem('highScore', highScore.value)
      }
    }

    const restartGame = () => {
      resetGame()
      startGame()
    }

    const resetGame = () => {
      guess.value = null
      message.value = ''
      gameOver.value = false
      hintsUsed.value = 0
      guessHistory.value = []
      shakeInput.value = false
    }

    const refreshPage = () => {
      window.location.reload();
    }

    onMounted(() => {
      const storedName = localStorage.getItem('playerName')
      if (storedName) {
        playerName.value = storedName
      }
      const storedHighScore = localStorage.getItem('highScore')
      if (storedHighScore) {
        highScore.value = parseInt(storedHighScore)
      }
    })

    watch(playerName, (newName) => {
      localStorage.setItem('playerName', newName)
    })

    return {
      playerName,
      difficulty,
      guess,
      trialsLeft,
      maxTrials,
      message,
      gameStarted,
      gameOver,
      score,
      highScore,
      hintsUsed,
      maxHints,
      shakeInput,
      guessHistory,
      messageClass,
      progressBarColor,
      minNumber,
      maxNumber,
      startGame,
      makeGuess,
      getHint,
      restartGame,
      refreshPage
    }
  }
}
</script>

<style scoped>
.shake-animation {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  border: 3px solid red;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>