import express from 'express';
const route = express()
import { getLocation } from "../services/locationService";
  
  
  // Fixed route case and Cache-Control header
    route.get('/api/location', async  (req: any, res: any) => {
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

  export default route
