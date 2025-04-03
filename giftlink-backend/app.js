/*jshint esversion: 8 */
// app.js
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectToDatabase from './models/db.js'; // Adjust the path if necessary
import { loadData } from "./util/import-mongo/index.js"; // Adjust the path if necessary
import giftRoutes from './routes/giftRoutes.js'; // Task 1: Import giftRoutes
import searchRoutes from './routes/searchRoutes.js'; // Import searchRoutes
import pinoHttp from 'pino-http';
import logger from './logger.js'; // Adjust the path if necessary
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use("*", cors());
dotenv.config();
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    console.log('Connected to DB');
}).catch((e) => console.error('Failed to connect to DB', e));

app.use(json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
// (Already done above)

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
// (Already done above)

app.use(pinoHttp({ logger }));

// Use Routes
// Gift API Task 2: add the giftRoutes to the server by using the app.use() method.
app.use('/api/gifts', giftRoutes); // Task 2: Use giftRoutes

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
