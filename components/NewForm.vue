<template>
    <form class="max-w-2xl mx-auto bg-white-500 border rounded-lg shadow-lg p-10 font-sans ">
        <header class="mb-9 text-xl">
            <ul class="flex justify-beetween">
                <li>
                    <h1>
                        Edit Place

                    </h1>
                    </li>
                    <li class="ml-auto bg-blue-100 rounded-full  ">
                        <h1>
                            x
                        </h1>
                      
                    </li>

            </ul>
        </header>

        <div class="relative z-0 w-full mb-10 pb-5 group">
            <label  for="name" class="text-xs font-bold text-gray-500">
                NAME
            </label>
            <input type="text"  id="name"class="border block w-full px-2 py-2 text-lg bg-blue-50 transperant absolute  rounded-lg"/>
        </div>
        <div class="relative z-0 w-full mb-9 pb-10 group">
            <label for="description" class="text-xs font-bold text-gray-500">
                DESCRIPTION 
            </label>
            <textarea class="block w-full pb-8 py-2 text-lg border transperant bg-blue-50 absolute rounded-lg ">

            </textarea>

        </div>
        <div class="relative z-0 w-full mb-6 pt-10 group">
          <label class="text-xs font-bold text-gray-500">
            IMAGE URL
         </label>
          <input type= "url" class="w-full  block border px-2 py-2 text-lg transperant absolute bg-blue-50  rounded-lg">
        </div>

        <div class="grid md:grid-cols-2 md:gap-10">
    
            <!-- First Grid Item (Select) -->
    <div class="relative z-0 w-full group  mb-5 pt-10">
        <label for="visited-b4" class="text-sm mb-3 text-xs font-bold text-gray-500">
            BEEN THERE?
        </label>
        <select id="visited-b4" class="block w-full text-lg border  rounded-md bg-blue-50 px-2 custom-dropdown">
            <option>Yes</option>
            <option>No</option>
        </select>
    </div>

    <!-- Second Grid Item (Input) -->
    <div class="relative z-0 w-full custom-m group">
        <label for="visited" class="text-xs font-bold text-gray-500">
            VISITED DATE
        </label>
        <input type="text"   placeholder="MM/DD/YYYY" pattern="\d{2}/\d{2}/\d{4}"  id="visited" class="block w-full text-lg border border-gray-300 rounded-md py-2 px-2" />
    </div>
</div>

    
    <div class=" text-xs">
      <label class="uppercase text-xs font-bold font-gray-500">tags </label>
      <div class="flex items-start mt-4">
        <div class="flex items-col flex-col ">
          <h3 class="text-xs uppercase">Type</h3>
          <div class="flex flex-col space-y-1 pt-3 text-base">
            <label><input type="radio"> Adventures</label>
            <label><input type="radio"> Spirituality</label>
            <label><input type="radio"> Beach</label>
            <label><input type="radio"> City</label>
          </div>
        </div>
        <div class="flex flex-col items-col margin">
          <h3 class="text-xs uppercase">Humidity</h3>
          <div class="flex flex-col space-y-1 pt-3 text-base">
            <label><input type="radio"> Sunny</label>
            <label><input type="radio"> Temperate</label>
            <label><input type="radio"> Winter</label>
          </div>
        </div>
        <div class="flex items-col flex-col margin">
          <h3 class="text-xs uppercase">Flight</h3>
          <div class="flex flex-col space-y-1 pt-3 text-base">
            <label><input type="radio"> Medium</label>
            <label><input type="radio"> Long</label>
            <label><input type="radio"> Short</label>
          </div>
        </div>
      </div>
      <button class="border-4 border-blue-400 bg-blue-400 text-white rounded-lg py-3 px-8 my-6 text-sm">
        Sign in to edit
       

       </button>
  
      
    </div>



    </form>
   
</template>


<style>
.custom-dropdown{
    appearance: none;
    padding-bottom: 0.98rem;
}
.custom-m{
    margin-top: 2.5rem;
    

}

</style>