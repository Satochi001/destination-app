import dotenv from 'dotenv';
dotenv.config();
import cron from 'node-cron';
let app: any = null;

  import express from 'express';
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
    visited: boolean;
  }

  // Fixed CORS middleware (typos corrected)
  app.use((req : any, res : any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  cron.schedule('0 * * * *', async () => {
    console.log('Manually triggering fetchAndstore...');
    await fetchAndstore();
  });


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
      const result = await pool.query('SELECT * FROM destinations');


      const locations: UnsplashData[] = result.rows.map((row: any) => ({
        id: row.id,
        name: row.name, // Map 'location' to 'name'
        imgurl: row.imgurl, // Map 'img_url' to 'imgurl'
        flighttype: row.flight_type, // Map 'flight_type'
        climate: row.climate, // Map 'climate'
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
      res.setHeader('Cache-Control', 'public, max-age=3600');
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
      return data.map((item : any)=>({
        id: item.id,
        name: item.location?.name || 'unknown',
        imgurl: item.urls?.regular || 'unknown',
        flighttype: item.flight_type || 'unknown',
        climate: item.climate || 'unknown',
        visited: false,
      }));
    } catch(error){
        console.error('Failed to fetch API data', error);
        return null;
    }
  }

  //FUNCTION TO INSERT DATA IN OUR DB 

  async function storeDt({ id, name, imgurl }: UnsplashData): Promise<UnsplashData | null> {

    try {
      console.log('Storing data in the database:', { id, name, imgurl });

      const query = 'INSERT INTO destinations (id, name, imgurl) VALUES ($1, $2, $3) ON CONFLICT(id) DO NOTHING RETURNING *';
      const values = [id, name, imgurl];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to store data in DB', error);
      return null;
    }
  }
