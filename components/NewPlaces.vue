<template>
  <div class=" margin-places">
        <h1 class="p-2 pb-10"> Places we want to go </h1>
        <ul class="flex flex-wrap ">
            <li v-for='location in locations' :key ="location.name" class=" flex flex-col  items-col places bg-white shadow-lg border border-gray-200 rounded-lg ">
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

<script>

 export default{
    data(){
        return{
            locations: []
        }
    },
    // now fetching data from our json file in directory 
    mounted(){
        fetch('/locations.json')
        .then(response => response.json())
        .then(data=>{
            this.locations = data
        })
        .catch((error)=>{
            console.error('Error, failed to fetch json data:', error)
        })
    }
 }
</script>

<style>
img{
    border-radius: 5px 5px 0px 0px;
    width: 100%;
}

  .places{
    width: 290px;
    margin: 0px 10px  20px 10px;
    
  }

  h1 {
    font-size: 29px;
    font-weight: 500;
    font-family: sans-serif;
    color: #111827;
  }
  .margin-places{
    padding: 90px;
   
    
  }
  p{
    background-color: #dbeafe;
    border-radius: 10px;
    padding: 4px 10px;
    font-size: 13px;
    color: #4a4a4a;
  }

  
  
  
</style>