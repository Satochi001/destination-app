import dotenv from 'dotenv';
dotenv.config();

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
  

  app.get('/unsplash', async (req: any, res: any) => {
    try {
      const data = await fetchUnsplashDt();
      if (!data) {
        res.status(500).json({ error: 'Failed to retrieve data' }); // Changed to json()
        return;
      }
      const storedDT = await storeDt(data);
      res.json(storedDT || { error: 'No data stored' });
    } catch (error) {
      res.status(500).json({ error: 'Internal system error' }); // Standardized to json()
    }
  });



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
  async function fetchUnsplashDt(): Promise<UnsplashData | null> {

    try {
      const res = await fetch('https://api.unsplash.com/collections/98759449/photos?per_page=5', {
        headers: { Authorization: `Client-ID ${access_key}` },
      });

      if (!res.ok) throw new Error('Failed to retrieve data from Unsplash');

      const data = await res.json();
      return {
        id: data.id,
        name: data.location?.name || 'unknown',
        imgurl: data.urls?.regular || 'unknown',
        flighttype: data.flight_type || 'unknown',
        climate: data.climate || 'unknown',
        visited: false,
      };
    } catch(error){
        console.error('Failed to fetch API data', error);
        return null;
    }
  }

  //FUNCTION TO INSERT DATA IN OUR DB 

  async function storeDt({ id, name, imgurl }: UnsplashData): Promise<UnsplashData | null> {

    try {
      const query = 'INSERT INTO destinations (id, name, imgurl) VALUES ($1, $2, $3) RETURNING *';
      const values = [id, name, imgurl];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to store data in DB', error);
      return null;
    }
  }
