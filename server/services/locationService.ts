import pool from "../database/db";
import type { UnsplashData } from "../database/storedt";




export async function getLocation(): Promise<UnsplashData[] | null> {
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