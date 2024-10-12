<template>
  <NewNavbar 
    :toggleLogin="showLogin"  
    @toggleLogin="handleToggleLogin"
  />     
  
  <div>
    <Login v-show="showLogin"
    :toggleLogin="showLogin"  
    @toggleLogin="handleToggleLogin"    />
  </div>

  <div>
    <div class="flex">
      <NewDestination
        :selectedType="selectedType"
        :selectedHumidity="selectedHumidity"
        :selectedFlight="selectedFlight"
        @filterChange="handleFilterChange"
      />
      <Imagedisplay
        :location="randomLocation"
        @openOverlay="openOverlay"
      />
    </div>

    <div v-if="overlayOpen"   class="tinted-background"></div>
    <div v-if="showLogin"   class="tinted-background"></div>
    <div class="margin-places">
      <h1 class="p-2 pb-10" style="cursor: pointer;">Places we want to go</h1>
      <ul class="flex flex-wrap">
        <li
          v-for="(location, index) in locations"
          :key="index"
          @click="openOverlay(location)"
          class="flex flex-col items-start places bg-white shadow-lg border border-gray-200 rounded-lg cursor-pointer"
        >
          <img :src="location.imgurl" alt="Location Image" />
          <div class="pl-5 pt-5">
            <h4 class="text-lg font-bold font-serif pl-1 pb-8">{{ location.name }}</h4>
            <div class="flex flex-wrap gap-3 pl-0.5 pb-8">
              <p class="flex items-center"><span>{{ location.flighttype }}</span></p>
              <p class="flex items-center"><span>{{ location.climate }}</span></p>
              <p class="flex items-center"><span>{{ location.tag }}</span></p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <NewForm
      :isVisible="overlayOpen"
      :selectedLocation="selectedLocation"
      @closeOverlay="closeOverlay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import Imagedisplay from './imagedisplay.vue';
import NewDestination from './NewDestination.vue';
import type { Location } from '../public/types.ts';

// Define reactive state variables
const locations = ref<Location[]>([]);
const overlayOpen = ref<boolean>(false);
const selectedLocation = ref<Location | null>(null);
const selectedHumidity = ref<string | null>(null);
const selectedFlight = ref<string | null>(null);
const selectedType = ref<string | null>(null);
const randomLocation = ref<Location | null>(null);
const showLogin = ref(false);

// Handle login display
const handleToggleLogin = () => {
  showLogin.value = !showLogin.value;
  fixedpage();
  console.log("Login button clicked");
};

const fixedpage =()=>{
  if(showLogin.value===true){
     document.documentElement.style.overflow ="hidden";
  }else{
    document.documentElement.style.overflow=""
  }
}
// Computed property to filter locations based on selected filters
const filteredLocations = computed(() => {
  return locations.value.filter((location) => {
    const matchesType = selectedType.value ? location.tag === selectedType.value : true;
    const matchesHumidity = selectedHumidity.value ? location.climate === selectedHumidity.value : true;
    const matchesFlight = selectedFlight.value ? location.flighttype === selectedFlight.value : true;

    return matchesType && matchesHumidity && matchesFlight;
  });
});

// Watch filteredLocations to update randomLocation when the filters change
watchEffect(() => {
  const filtered = filteredLocations.value;
  if (filtered.length > 0) {
    randomLocation.value = getRandomLocation(filtered);
  } else {
    randomLocation.value = null;
  }
});

// Function to get a random location from the filtered locations
const getRandomLocation = (filtered: Location[]): Location | null => {
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }
  return null;
};

// Method to update selected filters when filter changes
const handleFilterChange = (payload: { type: string | null; humidity: string | null; flight: string | null }) => {
  selectedHumidity.value = payload.humidity;
  selectedFlight.value = payload.flight;
  selectedType.value = payload.type;
};

// Function to open the overlay and lock body scroll
const openOverlay = (location: Location) => {
  selectedLocation.value = location;
  overlayOpen.value = true;
  document.documentElement.style.overflow = 'hidden'; // Lock body scroll
};

// Function to close the overlay and unlock body scroll
const closeOverlay = () => {
  overlayOpen.value = false;
  document.documentElement.style.overflow = ''; // Unlock body scroll
};

// Fetch locations (mocking with an example URL for now)
const fetchedLocation = async () => {
  try {
    const response = await fetch('/locations.json');
    const data: Location[] = await response.json();
    locations.value = data;
  } catch (error) {
    console.error("Error trying to fetch JSON:", error);
  }
};

// Fetch data on mount
onMounted(fetchedLocation);
</script>

<style scoped>
.tinted-background {
  /* Add your styles for the tinted background here */
}
.margin-places {
  /* Add your styles for margin places here */
}
.places {
  /* Add your styles for place cards here */
}
</style>
