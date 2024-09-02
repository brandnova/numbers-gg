<template>
    <div>
      <Navbar />
      <div class="container mx-auto mt-8 p-4">
        <h1 class="text-3xl font-bold mb-4">
          About Numbers GG 
          </h1>
        <p class="mb-4">
          The Number Guessing Game is an interactive web application built with Vue 3 and Vite. 
          It challenges players to guess a randomly generated number within a specified range, 
          with different difficulty levels to keep things interesting.
        </p>
        <h2 class="text-2xl font-bold mb-2">Features:</h2>
        <ul class="list-disc list-inside mb-4">
          <li>Three difficulty levels: Easy, Medium, and Hard</li>
          <li>Score tracking with local storage for high scores</li>
          <li>Hint system to help players along</li>
          <li>Responsive design for all device sizes</li>
        </ul>
        <h2 class="text-2xl font-bold mb-2">About the Creator:</h2>
        <p class="mb-4">
          This game was created by <a href="https://github.com/brandnova/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline hover:text-blue-700">Ijeoma Jahsway</a>. 
        </p>
        <p class="mb-4">I'm a passionate web developer with a love for 
          creating engaging and accessible web applications and using my skills as a developer to solve real world problems. </p>
        <p>But you Can't solve much if you don't loosen up once in a while right. 😉</p>
        <p class="my-4">
          If you enjoyed playing this game, please consider starring the project on GitHub:
        </p>
        <a 
          href="https://github.com/brandnova/numbers-gg" 
          target="_blank" 
          rel="noopener noreferrer"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
        <i class="fa-solid fa-star"></i>
          Star on GitHub
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from './NavBar.vue'
  
  export default {
    name: 'AboutPage',
    components: {
      Navbar
    }
  }
  </script>