<template>
    <div class="margin pt-5 mt-10">
      <h1>Next Stops For This Year...</h1>
      <div class="flex items-start selection">
        <div class="flex items-col flex-col">
          <h3>Type</h3>
          <div class="flex flex-col space-y-2 pt-3 text-sm">
            <label><input type="radio"> Adventures</label>
            <label><input type="radio"> Spirituality</label>
            <label><input type="radio"> Tropical</label>
            <label><input type="radio"> Beach</label>
            <label><input type="radio"> City</label>
          </div>
        </div>
        <div class="flex flex-col items-col margin">
          <h3>Humidity</h3>
          <div class="flex flex-col space-y-2 pt-3 text-sm">
            <label><input type="radio"> Sunny</label>
            <label><input type="radio"> Temperate</label>
            <label><input type="radio"> Winter</label>
          </div>
        </div>
        <div class="flex items-col flex-col margin">
          <h3>Flight</h3>
          <div class="flex flex-col space-y-2 pt-3 text-sm">
            <label><input type="radio"> Medium</label>
            <label><input type="radio"> Long</label>
            <label><input type="radio"> Short</label>
          </div>
        </div>
      </div>
      <button class="border-4 border-blue-400 bg-blue-400 text-white rounded-md p-2 mt-10">
        Make a request right away
      </button>
  
      <div class="animation-wrapper ">
        <div ref="lottieAnimation">

        </div>
      </div>
    </div>
  </template>
  
  <script>
  import lottie from 'lottie-web'; // Ensure this import is correct
  export default {
    data() {
      return {
        animationLink: 'https://lottie.host/d5164730-2978-4d16-8d86-7cf1701ecffa/zs2Y8FU9JL.json'
      };
    },

    mounted(){
        lottie.loadAnimation({
            container: this.$refs.lottieAnimation,    //reference to use in the dom 
            renderer:'svg',
            loop: true,
            autoPlay: true,
            path: this.animationLink
        });

    }
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 38px;
    font-weight: 500;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  h3 {
    font-size: 13px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 400;
    color: #b0b0b0;
  }
  
  .selection {
    align-items: flex-start;
    margin-top: 50px;
    color: #4a4a4a;
  }
  
  .margin {
    margin-left: 6rem;
  }

  .animation-wrapper{
    position: absolute;
    width: 500px;
    bottom: 37%;
    left: 55%;
  } 
 
  </style>
  