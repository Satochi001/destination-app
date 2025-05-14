import  dotenv from "dotenv" ;
dotenv.config(); 

  //create fucntion that call for the wealther api 

  export async function fetchWeatherApi (location : string ): Promise<string>{
    try{
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`);
      const data = await res.json();
      return data.wealther[0].main || 'unknown '; 

    }catch(error){
      console.log('failed to get location weather :', error);
      return 'unknown';

    }
  }
