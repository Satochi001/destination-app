<template>
        <nav class="flex items-center justify-between bg-blue-500 text-white p-4">
    <div class="flex items-center w-full pl-4 pr-5">
        <Icon name="uil:plane" style="color: white; font-size: 32px; transform: rotate(45deg)"/>

        <ul class="flex w-full">    
            <li class="logo">
                Time to tour the world

            </li>    
        
       <button class="ml-auto addplace " @click="$emit('toggleLogin')">
        Add place
       </button>

  </ul>
    </div>
</nav>


 
</template>

<script setup lang="ts">

// Use defineProps to declare props

const props = defineProps<{
    toggleLogin: boolean
}>();





</script>

