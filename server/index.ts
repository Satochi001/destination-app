import dotenv from 'dotenv';
dotenv.config();
import cron from 'node-cron';
let app: any = null;

  import express, { json } from 'express';
  import pool from './database/db';
  
  app = express();
  app.use(express.json());

  const access_key = process.env.UNSPLASH_ACCESS_KEY;

  interface UnsplashData {
    id: string; // Use 'string' if IDs are not strictly numeric
    name: string;
    imgurl: string;
    flighttype: string;
    climate: string;
    tag: string;
    visited: Boolean;
  }

  // Fixed CORS middleware (typos corrected)
  app.use((req : any, res : any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  cron.schedule('* * * * *', async () => {
    console.log('Manually triggering fetchAndstore...');
    await fetchAndstore();
  });

  console.log('cron schedule to run in minutes .')


  async function fetchAndstore(): Promise<void>{

    try {
      const data = await fetchUnsplashDt();
      if (!data || data.length === 0 ) {
        console.error('Failed to retrieve data');
        return;
      }

      for(const record of data){
        const storedDT = await storeDt(record);

        if(!storedDT){
          console.error('No data stored', record );
        }else {
          console.log('record successfully stroed:', storeDt)
        }

      }
      // STORE DT TO DB 
 
     
    } catch (error) {
      console.error('Internal system error:', error);

    }
  }



  async function getLocation(): Promise<UnsplashData[] | null> {
    try {
      //join releative tag  data to the the main destination column 
      const result = await pool.query(
        `
       SELECT d.*, 
       STRING_AGG(t.name, ', ') AS tags, 
       COALESCE(uv.visited, false) AS visited
       FROM destinations d
       LEFT JOIN destination_tags dt ON d.id = dt.destination_id
       LEFT JOIN tags t ON dt.tag_id = t.id
      LEFT JOIN user_visited uv ON d.id = uv.destination_id
      GROUP BY d.id, uv.visited;
    

        `
        
      );



      const locations: UnsplashData[] = result.rows.map((row: any) => ({
        id: row.id,
        name: row.name, // Map 'location' to 'name'
        imgurl: row.imgurl, // Map 'img_url' to 'imgurl'
        flighttype: row.flight_type, // Map 'flight_type'
        climate: row.climate, // Map 'climate'
        tag : row.tags || 'general',
        visited: row.visited ?? false, // Map 'visited'
      }));
      console.log('Mapped Locations:', locations); // Debugging

      return locations;

      
    }catch(error){
      console.error('theres is an error to get locatim from db', error);
      return null;

    }
  }

  // Fixed route case and Cache-Control header
  app.get('/api/location', async (req: any, res: any) => {
    try {
      res.setHeader('Cache-Control', 'public, max-age=100');
      const data = await getLocation();
  
      if (!data || data.length === 0) {
        res.status(404).json({ status: 'error', message: 'No locations found' });
        return;
      }
  
      console.log('Backend Response:', data);
           res.json({ status: 'success', data: Array.isArray(data) ? data : [data] }); // Ensure data is always an array
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch locations' });
    }
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  // function to insert relational  tags into data base; 

  async function storetags(destinationId: string, tags: string): Promise<string | undefined> {
    try {
      
      //insert tag and get result 
      const tagResult = await pool.query(`INSERT INTO tags (name) VALUES($1) ON CONFLICT (name) DO NOTHING RETURNING id`, [tags]);

      console.log(tagResult)

      const tagId = tagResult.rows[0]?.id || (
        await pool.query(`SELECT id FROM tags WHERE name = $1`, [tags])
      ).rows[0].id;

      //link tag to destination 
      await pool.query(
        `INSERT INTO destination_tags (destination_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING `,
        [destinationId, tagId]
      );

      return `Tag with ${tagId} successfully linked to destination ${destinationId}`;
    } catch (error) {
      console.log("failed to store tags", error);
      return undefined;
    }
  }

// store boolean " visited location  users " 

async  function storeVisitedUsers (destinationId: string, userId : string, visited: Boolean ): Promise <string >{

  // insert and link destination with  valaue , 

  try { 
    console.log('Inserting into user_visited:', { userId, destinationId, visited: true });

     await pool.query(
      
      `
      INSERT INTO user_visited (user_id, destination_id, visited)
      VALUES($1, $2, $3)
      ON CONFLICT (user_id, destination_id)
      DO UPDATE SET visited = $3;
      `,
      [userId, destinationId, visited ]

    )

    return `User ${userId} successfully marked as visited for destination ${destinationId}`;


  }catch(error){
    console.log("ERROR TRYING TO INSERT VISITED USER LOC", error );
    throw new Error ("Failed to store visited user ");

  }


}




  //FUNCTION TO INSERT DATA IN OUR DB 
  //sql-injection Unchecked input in database commands can alter intended queries

  async function storeDt({ id, name, imgurl, flighttype, climate, tag, visited }: UnsplashData): Promise<UnsplashData | null> {
    try {
      const query = `
        INSERT INTO destinations (id, name, imgurl, flight_type, climate)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT(id) DO NOTHING
        RETURNING *
      `;
  
      const values = [id, name, imgurl, flighttype, climate];
      const result = await pool.query(query, values);
  
      console.log("Insert result:", result);
  
      if (result && result.rows && result.rows.length > 0) {
        await storetags(id, tag);
        // temperary givng storeVisited a dummy user, before dynamically giving it a real time user id . 
        await storeVisitedUsers(id, "1", false );
        return result.rows[0];
      } else {
        console.warn(`No rows returned for destination ${id}`);
        return null;
      }
    } catch (error) {
      console.error("Failed to store data in DB", error);
      return null;
    }
  }
  

  // function to determine flight type 

  
  function calculateDistance(loc1: { lat: number; lon: number }, loc2: { lat: number; lon: number }): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lon - loc1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) * Math.cos((loc2.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }


  //create fucntion that call for the wealther api 

  async function fetchWealtherApi (location : string ): Promise<string>{
    try{
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`);
      const data = await res.json();
      return data.wealther[0].main || 'unknown '; 

    }catch(error){
      console.log('failed to get location weather :', error);
      return 'unknown';

    }
  }


  // function to relational tags; 

  async  function assignTags (locationName: string): Promise<string>{
    // save tag data 
    if(locationName.toLowerCase().includes('mountain') ||locationName.toLowerCase().includes('wave') || locationName.toLocaleLowerCase().includes('waterfall')) return "adventures"; 
    if(locationName.toLocaleLowerCase().includes('gate')) return  "spirituality";
    if(locationName.toLocaleLowerCase().includes('seashore')) return  "beach";
    if(locationName.toLowerCase().includes('sunset') ||locationName.toLowerCase().includes('daytime' )) return "natural"; 
    if(locationName.toLowerCase().includes('white') ||locationName.toLowerCase().includes('castle' )) return "solitude"; 
    if(locationName.toLowerCase().includes('building') ||locationName.toLowerCase().includes('airplane' )) return "city"; 
      return 'general'
    
  }


  //FUNCTION TO FETCH DATA FROM UNSPLASH
  async function fetchUnsplashDt(): Promise<UnsplashData[] | null> {

    try {
      console.log('Fetching data from Unsplash...');

      const res = await fetch('https://api.unsplash.com/collections/98759449/photos?per_page=30', {
        headers: { Authorization: `Client-ID ${access_key}` },
      });

      if (!res.ok) throw new Error('Failed to retrieve data from Unsplash');

      const data = await res.json();
      console.log("unsplash response witn data ", data)



      //hardcoded-credentials Embedding credentials in source code risks unauthorized access, update later 
      return await Promise.all(
        data.map(async  (item : any)=> {
          const  climate = await fetchWealtherApi(item.location?.name || 'unknown');
          const tags  = await assignTags(item.location?.name || item.alt_description);
          return {
            id: item.id,
            name: item.location?.name || item.alt_description|| 'unknown',
            imgurl: `${item.urls?.raw}&w=800&h=600&fit=crop`,
            flighttype: 'null',
            climate,
            tag : tags,
            visited: false,

          }

          
        }),
        
      )
    } catch(error){
        console.error('Failed to fetch API data', error);
        return null;
    }
  }