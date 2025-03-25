import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import  pool  from './database/db.js';

import fs from "fs";
import path from "path";
const app = express ();
app.use(json());



const fallbackPath = path.join(process.cwd(), "./public/locations.json");


//create  api route to get all file from route;\
app.get('/destination', async (req, res) =>{
    console.log("Current working directory:", process.cwd());
    try {
        const result = await pool.query('SELECT * FROM wrong_table_name'); // Intentional error
        res.json(result.rows)
    } catch(err){
        if(fs.existsSync(fallbackPath)){
        const fallbackData= JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
        return res.json(fallbackData)

        }
        console.error(err);
        res.status(500).send('Server Error, and database failed');

        
    }
});

// creaate port to start server 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
})
