/* Beach in Ibiza, Spain:
GET /api/places?country=Spain&type=beach&search=Ibiza

# Spiritual places in India:
GET /api/places?country=India&type=spiritual

# Luxury hotels in any country:
GET /api/places?type=luxury
*/



import dotenv from 'dotenv'; 
dotenv.config();
import { fetchWeatherApi } from '../apis/weatherApi';
import { assignTags } from '../database/tags';


// dynamic parameter table 
const access_key = process.env.UNSPLASH_ACCESS_KEY;

export async function fetchUnsplashDt(
    Apiurl: string, param:
     {country: string; type: string; location: string }, 
     method: string = 'GET', body: any = null, headers:Record<string,string > ={}
): Promise<any[] | null> {
    try{
        console.log('fetching data from unsplash');
        const  {country, type, location } = param;
        const  unsplashParam = `${country} ${type} ${location}`
         
        const Apiurl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashParam + ' travel')}&per_page=5`; 


        const defualtHeader = {
            'Content-Type': 'application/json', 
            Authorization: `Client-ID ${access_key}`,
            ...headers
        }

        const res = await fetch (Apiurl,{
            method,
            headers: defualtHeader,
            body : body ?JSON.stringify(body):null
            });

            //check if resposne is not  okay ? 
            if(!res.ok) throw new Error('Failed to retrieve data from unsplash api'); 

            const data = await res.json();
            console.log(`unsplash response data` , data); 

            return Promise.all(
                data.results.map(async  (item : any)=> {
                    const  climate = await fetchWeatherApi(item.location?.name || 'unknown');
                    const tags  = await assignTags(item.location?.name || item.alt_description);
                    return {
                      id: item.id,
                      name: item.location?.name || item.alt_description|| 'unknown',
                      imgurl: `${item.urls?.raw}&w=800&h=600&fit=crop`,
                      flighttype: null,
                      climate,
                      tag : tags,
                      visited: false,
          
                    }
             }),
     )

    }catch(error){
        console.error("Failed to fetch Api data", error)
        return null

    }

}