<template>
  <NewNavbar 
    :toggleLogin="showLogin"  
    @toggleLogin="handleToggleLogin"
  />     
  
  <div>
    <Login v-show="showLogin"
    :toggleLogin="showLogin"  
    @toggleLogin="handleToggleLogin"/>
  </div>

  <div>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 m-5 sm:m-5 lg:m-10 xl:m-20 w-full">
 

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
    <div class="m-12 sm:m-12 lg:m-16 xl:m-24 md:m-12">
      <h1 class="p-2 pb-10 sm: pl-0 text-sm sm:text-base md:text-xl lg:text-3xl" style="cursor: pointer; ">Places we want to go</h1>   

      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        <li
          v-for="(location, index) in locations"
          :key="index"
          @click="openOverlay(location)"
          class="flex flex-col items-start relative bg-white shadow-lg border  border-gray-200 rounded-lg cursor-pointer  
           "
        >
          <img :src="location.imgurl" alt="Location Image" />
          <div class="pl-5 pt-5">
            <h4 class="text-lg font-bold font-serif pl-1 pb-8">{{ location.name }}</h4>
            <div class="flex flex-wrap gap-3 pl-0.5 pb-8">
              <p  class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{ location.flighttype }}</span></p>
              <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{ location.climate }}</span></p>
              <p class="flex items-center"><Icon name="uil:tag" style="font-size: 13px;" class="w-5"/><span>{{ location.tag}}</span></p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <NewVisitedPlaces
    :locations="locations"
    :getVisitedLocations ="getVisitedLocations"
    @openOverlay="openOverlay"/>


    <NewForm
      :isVisible="overlayOpen"
      :selectedLocation="selectedLocation"
      :selectedType="selectedType"
      :selectedHumidity="selectedHumidity"
      :selectedFlight="selectedFlight"
    
         @closeOverlay="closeOverlay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';
import Imagedisplay from './imagedisplay.vue';
import NewDestination from './NewDestination.vue';
import NewVisitedPlaces from './NewVisitedPlaces.vue';
import type { Location } from '../public/types';

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


//this handle page to display in fixed way. 
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

//function to get visited location 

const getVisitedLocations =()=>{
  return locations.value.filter(location => location.visited === true );
}





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
    const response = await fetch('/api/location');
    console.log('loading from end  ')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Expected JSON, got ${contentType}`);
    }

    const data = await response.json();
    console.log('API Response FRONTEND :', data); // Debugging

    // Validate and assign locations
    if (Array.isArray(data.data)) {
      locations.value = data.data;
    } else {
      console.error('API returned invalid data:', data);
      locations.value = [];
    }
  } catch (error) {
    console.error('API Failure:', error);
    locations.value = [];
  }
};

// Fetch data on mount
onMounted(fetchedLocation);
</script>


