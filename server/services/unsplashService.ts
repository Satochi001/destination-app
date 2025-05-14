import { fetchUnsplashDt } from "../apis/unsplash_api";
import { storeDt } from "../database/storedt";

  export async function fetchAndstore(): Promise<void>{

    try {
        const res = await Promise.all([
            fetchUnsplashDt('',{country: 'spain' , type: 'beach', location: 'ibiza' },'GET', null , {}),
            fetchUnsplashDt('',{country: 'spain' , type: 'hotel', location: 'ibiza' },'GET', null , {}),
            fetchUnsplashDt('',{country: 'Nigeria' , type: 'beach', location: 'Lagos' },'GET', null , {}),
            

        ])
      
      if (!res) {
        console.error('Failed to retrieve data');
        return;
      }
      const flatRes = res.flat()

      for(const data of flatRes){
        
              // STORE DT TO DB 

        const storedDT = await storeDt(data);

        if(!storedDT){
          console.error('No data stored', data );
        }else {
          console.log('record successfully stroed:', storedDT)
        }

      }
 
     
    } catch (error) {
      console.error('Internal system error:', error);

    }
  }
