<template>
  <div class="margin pt-5 mt-10">
    <h1>Next Stops For This Year...</h1>
    <div class="flex items-start selection">
      <div class="flex items-col flex-col">
        <h3>Type</h3>
        <div class="flex flex-col space-y-2 pt-3 text-sm">
          <label>
            <input type="radio" name="type" value="adventures" :checked="selectedType === 'adventures'" @change="updateType('adventures')"> Adventures
          </label>
          <label>
            <input type="radio" name="type" value="spirituality" :checked="selectedType === 'spirituality'" @change="updateType('spirituality')"> Spirituality
          </label>
          <label>
            <input type="radio" name="type" value="beach" :checked="selectedType === 'beach'" @change="updateType('beach')"> Beach
          </label>
          <label>
            <input type="radio" name="type" value="city" :checked="selectedType === 'city'" @change="updateType('city')"> City
          </label>
        </div>
      </div>

      <div class="flex flex-col items-col margin">
        <h3>Humidity</h3>
        <div class="flex flex-col space-y-2 pt-3 text-sm">
          <label>
            <input type="radio" name="humidity" value="sunny" :checked="selectedHumidity === 'sunny'" @change="updateHumidity('sunny')"> Sunny
          </label>
          <label>
            <input type="radio" name="humidity" value="temperate" :checked="selectedHumidity === 'temperate'" @change="updateHumidity('temperate')"> Temperate
          </label>
          <label>
            <input type="radio" name="humidity" value="winter" :checked="selectedHumidity === 'winter'" @change="updateHumidity('winter')"> Winter
          </label>
        </div>
      </div>

      <div class="flex items-col flex-col margin">
        <h3>Flight</h3>
        <div class="flex flex-col space-y-2 pt-3 text-sm">
          <label>
            <input type="radio" name="flight" value="Medium Flight" :checked="selectedFlight === 'Medium Flight'" @change="updateFlight('Medium Flight')"> Medium
          </label>
          <label>
            <input type="radio" name="flight" value="Long Flight" :checked="selectedFlight === 'Long Flight'" @change="updateFlight('Long Flight')"> Long
          </label>
          <label>
            <input type="radio" name="flight" value="Short Flight" :checked="selectedFlight === 'Short Flight'" @change="updateFlight('Short Flight')"> Short
          </label>
        </div>
      </div>
    </div>

    <button @click="updateFilter" class="border-4 border-blue-400 bg-blue-400 text-white rounded-md p-2 mt-10">
      Make a request right away
    </button>

    <div class="animation-wrapper">
      <div ref="lottieAnimation"></div>
    </div>
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
  selectedType.value = value;  // Update local reactive variable
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
};

// Lottie animation
onMounted(() => {
  const lottieAnimation = ref<HTMLDivElement | null>(null);
  
  if (lottieAnimation.value) {
    lottie.loadAnimation({
      container: lottieAnimation.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/d5164730-2978-4d16-8d86-7cf1701ecffa/zs2Y8FU9JL.json'
    });
  }
});
</script>
