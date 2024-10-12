<template>
    
    <div class="relative display-co0ntainer">
      <ul class="flex flex-wrap d-image" v-if="location">
        <!-- Loop through the locations and create clickable list items -->
        <li
          class="flex flex-col items-start bg-white shadow-lg border border-gray-200 rounded-sm cursor-pointer"  
          @click="$emit('openOverlay', location)"
        >
          
          <img :src="location.imgurl" alt="Location Image" />
          <div class="pl-5 pt-5">
            <h4 class="text-lg font-bold font-serif pl-1 pb-8">{{ location.name   }}</h4>
            <div class="flex flex-wrap gap-3 pl-0.5 pb-8">
              <p class="flex items-center"><span>{{location.tag }}</span></p>
              <p class="flex items-center"><span>{{location.climate}}</span></p>
              <p class="flex items-center"><span>{{location.flighttype}}</span></p>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>No matching locations found based on your filter criteria.</p>
      

    </div>
  </template>
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Location } from '../public/types.ts'; // Import the Location type
  
  export default defineComponent({
    name: 'Imagedisplay', // Name your component
    props: {

      location: {
        type: Object as PropType<Location | null>, // Define prop type
        required: false, // Make it optional (nullable)


      },
    },

  });
  </script>
  
  
  <style scoped>
  .display-co0ntainer{
    display: block;
  }
  .d-image {
    display: block;
    bottom: 0;
    margin-left: 9rem;
    margin-top: 7%;
    width: 650px;
    z-index: -1;
  }
  </style>
  