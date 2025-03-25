//dotenv config 

//get response and catch error 

import dovenv from "dotenv";
dovenv.config();

import axios from "axios";




const access_key=process.env.UNSPLASH_ACCESS_KEY;
const url = "https://api.unsplash.com/photos/random";

//make an api get resquest 
//async create function and get user ]
async function getImage() {

    console.log(access_key)
    try{
        const res = await axios.get(url,{
            headers : {
                Authorization:`Client-ID ${access_key}`
            }

        });

        return res.data; 

    }catch (error){
        console.error("api called failled ", error.message)
        throw error


    }
    
}
getImage();    








//connect data base table 
// and make an api call 