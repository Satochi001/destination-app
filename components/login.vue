<template>

   <div class="flex   z-[100] relative auth-container">
      
      <div class="shadow-lg border bg-white  rounded-lg flex flex-col auth">
        <div class="ml-auto font-strong" @click="$emit('toggleLogin')" role="button">
              <div class="border border-black h-4 rotate-45 translate-y-1 -translate-x-2"></div>
              <div class="border border-black h-4 -rotate-45 -translate-y-3 -translate-x-2"></div>
            </div>

        <div class="flex flex-col p-2 " >
        <label class ="text-base" for="email">Email:</label>
        <input  v-model="email" class="border  rounded-sm p-3  block border px-2 py-2 text-base transperant  bg-white "  type="email" placeholder="Please enter your email" id="email" />
      </div>
      <div class="flex flex-col  p-2" >
        <label class="text-base" for="password">Password:</label>
        <input v-model="password" class="border rounded-sm p-3  block border px-2 py-2 text-base transperant  bg-white " type="password" placeholder="Password" id="password" />
      </div>
      <button class="rounded-sm border m-2 mt-10 p-3 bg-blue-300" @click="handleAuthentication">Login </button>

    </div>
     </div>

</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Ensure this path points to your firebase config

const email = ref('');
const password = ref('');



const props = defineProps<{
    toggleLogin: boolean
}>();


// Handle authentication
const handleAuthentication = async () => {
  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = result.user;
    console.log("User signed in:", user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};



     




//function that toggle the login button 


</script>
<style scopped>

.auth-container{
    width: 100vw;
}

.auth{
    
    position : fixed;
    width: 24rem;
    padding: 35px;
    justify-content: center;
    align-content: center;
    top: 32%;
    right: 40%;
    
}
   
</style>