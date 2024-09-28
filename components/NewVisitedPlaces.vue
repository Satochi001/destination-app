<template>
    <div class="margin-places">
        <h1 class="p-2 pb-10">Places we've been</h1>
        <ul class="flex flex-wrap">
            <li v-for= 'location in getVisitedlocation()' :key = "location.name" class="flex flex-col items-col bg-white border shadow-lg rounded-lg places">
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
          locations:[]
        }
    },
    methods : {
        getVisitedlocation(){
       return this.locations.filter(location=> location.visited===true);
     }
    },
    
    mounted(){
      fetch('/locations.json')
      .then(response => response.json())
      .then(data=>{
        this.locations = data
      })
      .catch(Error=>{
        console.error('Error: failed to load json file:', Error)
      })

    }
}

</script>