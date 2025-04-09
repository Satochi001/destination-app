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
    visited: boolean;
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
    console.log('fetchAndstore function called at:', new Date().toISOString());

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
      const result = await pool.query(`
        SELECT d.*, ARRAY_AGG(t.name) AS tags
        FROM destinations d 
        LEFT JOIN destination_tags dt ON d.id = dt.destination_id
        LEFT JOIN  tags t ON dt.tag_id = t.id
        GROUP BY d.id;`
      );



      const locations: UnsplashData[] = result.rows.map((row: any) => ({
        id: row.id,
        name: row.name, // Map 'location' to 'name'
        imgurl: row.imgurl, // Map 'img_url' to 'imgurl'
        flighttype: row.flight_type, // Map 'flight_type'
        climate: row.climate, // Map 'climate'
        tag : row.tags || [],
        visited: row.visited, // Map 'visited'
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

  async function storetags(destinationId: string, tags: string): Promise<void>{
    try{
      for(let tag of tags){
        const  tagResult = await pool.query(`INSERT INTO tags (name) VALUES($1) ON CONFLICT (name) DO NOTHING RETURNING id`, [tag]
        );

        const tagId = tagResult.rows[0]?.id || (
          await pool.query(`SELECT id FROM tags WHERE name = $1`, [tag])
        ).rows[0].id;

      

      //link tag to destinatin 

      await pool.query(
        `INSERT INTO destination_tags (destination_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING `,
        [destinationId, tagId]
      )
    }
    }catch(error){
      console.log("failed to store tags", error )

    }
  }



  //FUNCTION TO INSERT DATA IN OUR DB 
  //sql-injection Unchecked input in database commands can alter intended queries

  async function storeDt({ id, name, imgurl, flighttype,climate, tag, visited }: UnsplashData): Promise<UnsplashData | null> {

    try {
      console.log('Storing data in the database:', { id, name, imgurl, flighttype, climate, tag, visited });

    const query = `INSERT INTO destinations (id, name, imgurl, flight_type, climate, visited)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT(id) DO NOTHING
      RETURNING *`;
    const values = [id, name, imgurl, flighttype, climate, visited];
      const result = await pool.query(query, values);

      if(result.rows[0]){
        await storetags(id, tag)
      }
      return result.rows[0];
    } catch (error) {
      console.error('Failed to store data in DB', error);
      return null;
    }
  }

  // function to determine flight type 

  function determineFlightType(userLocation: { lat: number; lon: number }, destinationLocation: { lat: number; lon: number }): string {
    const distance = calculateDistance(userLocation, destinationLocation); // Use Haversine formula
    return distance < 1500 ? 'short' : 'long';
  }
  
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

  async  function assignTags (locationName: string): Promise<string[]>{

    //array to save matched taged 
    const tags: string[]  = [];


    if(locationName.toLowerCase().includes( 'mountain' )) tags.push("resort"); 
    if(locationName.toLocaleLowerCase().includes('temple')) tags.push("spiritual");
    if(locationName.toLocaleLowerCase().includes('museum')) tags.push("Historical")
    
    return tags.length > 0 ? tags : [`general`];

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
          const tags  = await assignTags(item.location?.name || 'unknown ');

          return {
            id: item.id,
            name: item.location?.name || item.alt_description|| 'unknown',
            imgurl: `${item.urls?.regular}&w=800&h=600&fit=crop`,
            flighttype: 'null',
            climate,
            tag : tags,
          }
          
        })
        
      )
    } catch(error){
        console.error('Failed to fetch API data', error);
        return null;
    }
  }