import pool from "./db";
import { storeVisitedUsers } from "../models/userVisitedModel";
import { storetags } from "./tags";


 export interface UnsplashData {
  id : string,
  name: string ,
  imgurl: string , 
  flighttype: string , 
  climate: string,
  tag : string,
  visited: boolean

}



  //FUNCTION TO INSERT DATA IN OUR DB 
  //reminder -- sql-injection Unchecked input in database commands can alter intended queries

export async function storeDt({ id, name, imgurl, flighttype, climate, tag, visited }: UnsplashData): Promise<UnsplashData[] | null> {
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