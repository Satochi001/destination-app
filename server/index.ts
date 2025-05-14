import express from 'express';
import cron from 'node-cron';

import  locationRoutes from './routes/locationRoutes';
import { fetchAndstore } from './services/unsplashService';



const app = express();
app.use(express.json());



cron.schedule('* * * * *', async () => {
    console.log('Manually triggering fetchAndstore...');
    fetchAndstore();
  });
// Routes
app.use('/', locationRoutes);




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;



