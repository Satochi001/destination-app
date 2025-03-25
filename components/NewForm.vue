<template>

    <!-- Overlay Form, only visible if openOverlay is true -->
    <div v-if="isVisible" class="overlay fixed inset-0 block z-[100]  parent">
      <form class="mx-auto border rounded-lg p-10 font-sans inset-0 z-[100]  overlay">
        <header class="mb-9 text-base font-serif">
          <ul class="flex">
            <li>
              <h1>Edit Place</h1>
            </li>
            <!-- Cancel "X" Button -->
            <div class="ml-auto font-strong" @click="emit('closeOverlay')" role="button">
              <div class="border border-black h-4 rotate-45 translate-y-1 -translate-x-2"></div>
              <div class="border border-black h-4 -rotate-45 -translate-y-3 -translate-x-2"></div>
            </div>
          </ul>
        </header>
  
        <!-- Form Fields  -->
        <div class="relative w-full mb-10 pb-5 group">
          <label for="name" class="text-xs font-bold text-gray-500">NAME</label>
          <input type="text" id="name" class="border block w-full px-2 py-2 text-base bg-blue-50 rounded-lg" :placeholder="selectedLocation?.name ?? 'Enter place name'"/>
        </div>

        <!--  Map of location -->
        <displayMap />




  
        <!-- Other form fields here... -->
        <div class="relative z-0 w-full mb-9 pb-10 group">
            <label for="description" class="text-xs font-bold text-gray-500">
                DESCRIPTION 
            </label>
            <textarea class="block w-full pb-8 py-2 px-2 text-base border transperant bg-blue-50 absolute rounded-lg ">
            </textarea>
            </div>
            <div class="relative z-0 w-full mb-6 pt-10 group">
          <label class="text-xs font-bold text-gray-500">
            IMAGE URL
         </label>
          <input type= "url" class="w-full  block border px-2 py-2 text-base transperant absolute bg-blue-50  rounded-lg" 
          v-if="selectedLocation"
          v-model="selectedLocation.imgurl"/>
        </div>

        <div class="grid md:grid-cols-2 md:gap-10">
    
            <!-- First Grid Item (Select) -->
    <div class="relative z-0 w-full group  mb-7 pt-10 custom-select">
        <label for="visited-b4" class="text-sm mb-3 text-xs font-bold text-gray-500">
            BEEN THERE?
        </label>
        <select id="visited-b4" class="block w-full text-base border  rounded-md bg-blue-50 py-3 px-3 custom-dropdown">
            <option>Yes</option>
            <option>No</option>
            
        </select>
        <ul class="relative" >
            <li class="ml-auto absolute  custom-drop">
                       <div class="border border-black w-2 font-light rotate-45 translate-y-0 -translate-x-3" >
                       </div>
                       <div class="border border-black w-2 font-light -rotate-45 -translate-y-0.5 -translate-x-2">
                       </div>
                      
                    </li>
        </ul>
       

    </div>

    <!-- Second Grid Item (Input) -->
    <div class="relative z-0 w-full custom-m group">
        <label for="visited" class="text-xs font-bold text-gray-500">
            VISITED DATE
        </label>
        <input type="text"   placeholder="MM/DD/YYYY" pattern="\d{2}/\d{2}/\d{4}"  id="visited" class="block w-full text-base border border-gray-300 rounded-md py-2 px-2  " />
    </div>
</div>

    
    <div class=" text-xs">
      <h5 class="uppercase text-xs font-bold text-gray-500">tags </h5>
      <div class="flex items-start mt-6 space-x-24">
        <div class="flex items-col flex-col  ">
          <h3 class="text-xs uppercase " >Type</h3>
          <div class="flex flex-col space-y-1 pt-3  font-serif text-base">
            <label><input type="radio" name="type" value="adventures" :checked="selectedType === 'adventures'"> Adventures</label>
            <label><input type="radio" name="type" value="spirituality" :checked="selectedType === 'spirituality'" > Spirituality</label>
            <label><input type="radio" name="type" value="beach" :checked="selectedType === 'beach'" > Beach</label>
            <label><input type="radio" name="type" value="city" :checked="selectedType === 'city'" > City</label>
          </div>
        </div>
        <div class="flex flex-col items-col margin">
          <h3 class="text-xs uppercase">Humidity</h3>
          <div class="flex flex-col space-y-1 pt-3 text-base font-serif">
            <label><input type="radio" name="humidity" value="sunny" :checked="selectedHumidity === 'sunny'" > Sunny</label>
            <label><input type="radio" name="humidity" value="temperate":checked="selectedHumidity === 'temperate'" > Temperate</label>
            <label><input type="radio" name="humidity" value="winter" :checked="selectedHumidity === 'winter'" > Winter</label>
          </div>
        </div>
        <div class="flex items-col flex-col margin">
          <h3 class="text-xs uppercase font-serif">Flight</h3>
          <div class="flex flex-col space-y-1 pt-3 text-base  font-serif">
            <label><input type="radio" name="flight" value="Medium Flight"  :checked="selectedFlight === 'Medium Flight'"  > Medium</label>
            <label><input type="radio" name="flight" value="Long Flight"   :checked="selectedFlight === 'Long Flight'"> Long</label>
            <label>
              <input type="radio" name="flight" value="Short Flight"  :checked="selectedFlight === 'Short Flight'"

              > Short</label>
          </div>
        </div>
      </div>
      <button class="border-4 border-blue-400 bg-blue-400 text-white rounded-lg  px-8 py-3 my-6 text-base font-sans">
        Sign in to edit
       </button>
    </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import displayMap from './mapcomponent/displayMap.vue';
  // define props 
 // Define props for the FormOverlay component
const props = defineProps<{
  isVisible: boolean;
  selectedLocation: { name: string, imgurl : string} | null;
  selectedHumidity: string | null;
  selectedFlight: string | null;
  selectedType: string | null;
  
 
}>();

;

// Define emit for the closeOverlay event
const emit = defineEmits<{
  (event: 'closeOverlay'): void;
}>();


    

  
  
  </script>
  <style>
 
  
  
  .overlay{
      display: block;
      position: fixed;
      margin: 0px auto;
      width: 48%;
      top: 5%;
      right: 0%;
      background: white;
      overflow: scroll;
      opacity: 1;
  
      
  
  
  }
  .custom-dropdown{
      appearance: none;
      padding: 0.55rem 1rem;
  }
  .custom-m{
      margin-top: 2.5rem;
      
  
  }
  .custom-drop{
      left: 16.25rem;
      bottom: 1.1rem;
  }
  
  
  
  </style>
  