import pool from "../database/db";



// store boolean " visited location  users " 

export async  function storeVisitedUsers (destinationId: string, userId : string, visited: Boolean ): Promise <string >{

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