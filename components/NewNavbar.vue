<template>
<nav class="flex items-center justify-between bg-blue-500 text-white p-4">
    <div class="flex items-center w-full pl-4 pr-5">
        <Icon name="uil:plane" style="color: white; font-size: 32px; transform: rotate(45deg)"/>

        <ul class="flex w-full">    
            <li class="logo">
                Time to tour the world

            </li>    
        
       <li class="ml-auto addplace ">
        Add place
       </li>
  </ul>
    </div>
</nav> 
</template>

<style scoped>
.logo {
    font-size: 19px; 
    font-weight: 500; 
    padding: 8px 10px;
}
.addplace{
    font-size: 16px; 
    font-weight: 400; 
    border: 1px solid white;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 8px 20px;
   
    
  }
</style>