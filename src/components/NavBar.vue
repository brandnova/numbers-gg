<template>
    <nav class="bg-blue-500 p-4 rounded-t-xl">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-white text-2xl flex flex-crow font-bold mx-2">
            <span class="mx-1">
                <svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#FFFFFF" />
                    <text x="50" y="62" font-family="Arial, sans-serif" font-size="50" fill="#3B82F6" text-anchor="middle">?</text>
                    <path d="M25 70 Q 50 90 75 70" stroke="#3B82F6" stroke-width="5" fill="transparent" />
                </svg>
            </span>
            <span>Numbers GG</span>
        </router-link>
        <div class="space-x-2">
          <router-link to="/" class="cursor-pointer mx-2 rounded-lg text-white hover:underline">Home</router-link>
          <router-link to="/about" class="cursor-pointer mx-2 rounded-lg text-white hover:underline">About</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  }
  </script>