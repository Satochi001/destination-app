<template>
  <div class="m-5 w-[27rem]">
    <h1 class="text-sm sm:text-base md:text-xl lg:text-3xl">
      Next Stops For This Year...</h1>
    <div class="flex items-start flex-start mt-10 space-x-16 w-full selection">
      <div class="flex items-col flex-col space-y-2 ">
        <h3>Type</h3>
        <div class="flex flex-col space-y-4 pt-3 text-sm sm: text-[12px] md:text-[12px] lg:text-[14px]">
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="adventures" :checked="selectedType === 'adventures'" @change="updateType('adventures')"> Adventures
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="spirituality" :checked="selectedType === 'spirituality'" @change="updateType('spirituality')"> Spirituality
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="beach" :checked="selectedType === 'beach'" @change="updateType('beach')"> Beach
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="city" :checked="selectedType === 'city'" @change="updateType('city')"> City
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="general" :checked="selectedType === 'general'" @change="updateType('general')"> General
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="type" value="natural" :checked="selectedType === 'natural'" @change="updateType('natural')"> Natural
          </label>
        </div>
      </div>

      <div class="flex flex-col items-col  space-y-2">
        <h3>Humidity</h3>
        <div class="flex flex-col space-y-2 pt-3  text-sm sm: text-[12px] md:text-[12px] lg:text-[14px]" >
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="humidity" value="sunny" :checked="selectedHumidity === 'sunny'" @change="updateHumidity('sunny')"> Sunny
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="humidity" value="temperate" :checked="selectedHumidity === 'temperate'" @change="updateHumidity('temperate')"> Temperate
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="humidity" value="winter" :checked="selectedHumidity === 'winter'" @change="updateHumidity('winter')"> Winter
          </label>
        </div>
      </div>

      <div class="flex items-col flex-col  space-y-2 ">
        <h3>Flight</h3>
        <div class="flex flex-col space-y-2 pt-3  text-sm sm: text-[12px] md:text-[12px] lg:text-[14px]">
          <label>
            <input  class="md:scale-70 sm:scale-70" type="radio" name="flight" value="Medium Flight" :checked="selectedFlight === 'Medium Flight'" @change="updateFlight('Medium Flight')"> Medium
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="flight" value="Long Flight" :checked="selectedFlight === 'Long Flight'" @change="updateFlight('Long Flight')"> Long
          </label>
          <label>
            <input class="md:scale-70 sm:scale-70" type="radio" name="flight" value="Short Flight" :checked="selectedFlight === 'Short Flight'" @change="updateFlight('Short Flight')"> Short
          </label>
        </div>
      </div>
      <div class="animation-wrapper">
      <div ref="lottieAnimation" style="width: 360px;" class="relative"></div>
    </div>
    </div>
    

    <button @click="updateFilter" class="border-4 border-blue-400 bg-blue-400 text-white rounded-md p-2 mt-10 font-light font-roboto">
      Make a request right away
    </button> 

   
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';

// Define props from parent
const props = defineProps<{
  selectedHumidity: string | null;
  selectedFlight: string | null;
  selectedType: string | null;
}>();

// Emit events to the parent
const emit = defineEmits<{
  (event: 'filterChange', payload: { type: string | null; humidity: string | null; flight: string | null }): void;
  (event: 'update:selectedType', value: string): void;
  (event: 'update:selectedHumidity', value: string): void;
  (event: 'update:selectedFlight', value: string): void;
}>();

// Reactive properties to hold selected values
const selectedType = ref(props.selectedType);
const selectedHumidity = ref(props.selectedHumidity);
const selectedFlight = ref(props.selectedFlight);

// Methods to update filters and emit events
const updateType = (value: string) => {
  // Update local reactive variable
  selectedType.value = value;  
  emit('update:selectedType', value); // Emit to parent
  console.log('Selected  type:', value)
};

const updateHumidity = (value: string) => {
  selectedHumidity.value = value; // Update local reactive variable
  emit('update:selectedHumidity', value); // Emit to parent
  console.log('Selected Humidity:', value); // Debugging
};

const updateFlight = (value: string) => {
  selectedFlight.value = value; // Update local reactive variable
  emit('update:selectedFlight', value); // Emit to parent
  console.log('Selected it has been updated :', value)
};

// Update filter method to emit all selected values correctly
const updateFilter = () => {
  console.log("Button clicked"); // Check if this logs when the button is clicked
  emit('filterChange', {
    type: selectedType.value,
    humidity: selectedHumidity.value,
    flight: selectedFlight.value
  });
  hideAnimation();
  showimagecontainer();
};

//show image location
const showimagecontainer=()=>{
  const elements = document.getElementsByClassName('display-co0ntainer');
  if (elements.length > 0) {
    // Cast to HTMLElement to access style property
    (elements[0] as HTMLElement).style.display = 'block';
  }

}
//animation wrapper

const hideAnimation = (): void => {
  const elements = document.getElementsByClassName('animation-wrapper');
  if (elements.length > 0) {
    // Cast to HTMLElement to access style property
    (elements[0] as HTMLElement).style.display = 'none';
  }
};


// Lottie animation
const lottieAnimation = ref<HTMLDivElement | null>(null);

onMounted(() => {
  console.log('Component Mounted, attempting to load Lottie animation.');

  // Ensure the lottieAnimation ref is not null before loading animation
  if (lottieAnimation.value) {
    lottie.loadAnimation({
      container: lottieAnimation.value, // Reference to the div with ref="lottieAnimation"
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/f9093312-efb4-4d4b-a0f7-9161923fbdac/GTZmdkSanB.json',  // Path to Lottie JSON
    });

    console.log('Lottie animation initialized.');
  } else {
    console.error("Lottie animation ref is null");
  }
});
</script>
