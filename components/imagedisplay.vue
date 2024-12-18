<template>
    
    <div class="relative display-co0ntainer">
      <ul class="relative right-10 sm: right-[1rem] md:right-[3rem] lg:right-[7rem] xl:right-[5rem]  sm:w-[20rem] md:w-[27rem] lg:w-[36rem] xl:w-[40rem] w-full " v-if="location">


        <!-- Loop through the locations and create clickable list items -->
        <li
          class="flex flex-col items-start bg-white shadow-lg border border-gray-200 rounded-sm cursor-pointer  m-7"  
          @click="$emit('openOverlay', location)"
        >
          
          <img :src="location.imgurl" alt="Location Image" />
          <div class="pl-5 pt-5">
            <h4 class="text-lg font-bold font-serif pl-1 pb-8">{{ location.name   }}</h4>
            <div class="flex flex-wrap gap-3 pl-0.5 pb-8">
              <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{location.tag }}</span></p>
              <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{location.climate}}</span></p>
              <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{location.flighttype}}</span></p>
            </div>
          </div>
        </li>
        
      </ul>
      <ul v-else class=" m-[4rem] bg-blue-200 rounded-md h-[2rem] w-[30rem]"> 
        <span class="items-center flex justify-center m-[2rem]">No matching locations found based on your filter criteria.</span>
      </ul>
    
      

    </div>
  </template>
  <script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Location } from '../public/types.js'; // Import the Location type
  
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
    display:  none;
  }


  
  </style>
  