<template>
    <div id ="map"></div>

</template>
<script setup lang="ts">
import { onMounted } from "vue";
import leafLet from "leaflet";
import "leaflet/dist/leaflet.css";


onMounted(()=>{
    const map  = leafLet.map("map").setView([51.505, -0.09], 5);

    // addign open street tiles 
    leafLet.tileLayer(  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",

    }).addTo(map)


    // add marker 
    leafLet.marker([51.505, -0.09])
    .addTo(map)
    .bindPopup("destintion")
    .openPopup()



})

</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>