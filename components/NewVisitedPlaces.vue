<template>
    <div class="m-12 sm:m-12 lg:m-16 xl:m-24 md:m-12" >
      <h1 class="p-2 pb-10 sm: pl-0 text-sm sm:text-base md:text-xl lg:text-3xl cursor-pointer " >Places we've been</h1>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        
        
          <li v-for= 'location in getVisitedLocations()' :key='location.name' 
          class="flex flex-col items-start relative bg-white shadow-lg border  border-gray-200 rounded-lg cursor-pointer"
          @click="$emit('openOverlay', location)"
          >
                <img :src="location.imgurl"/>
               <div class="pl-5 pt-5">
             <h4 class='text-lg font-bold font-serif pl-1 pb-8' >{{ location.name }}</h4>
             <div class="flex flex-wrap gap-3 pl-0.5 pb-8">
                <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/>
                        <span>{{ location.flighttype }}</span>
                    </p>
               <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/>
                <span>{{ location.climate }}</span></p>
                <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/>
                    {{ location.tag }}</p>
                </div>    
            </div>

            </li>
        </ul>
    </div>
</template>

<script  lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Location } from '../public/types.ts'; // Import the Location type
  
export default defineComponent({
  name: 'NewVisitedPlaces',
    props :{
      locations: {
        type: Array as PropType<Location[]>,
        required: true ,
      },

      getVisitedLocations:{
        type: Function as PropType<()=>Location[]>,
        required: true,
      },
    },
});

</script>