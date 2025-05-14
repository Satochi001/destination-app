
import pool from "../database/db";
// function to insert relational  tags into data base; 

export async function storetags(destinationId: string, tags: string): Promise<string | undefined> {
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