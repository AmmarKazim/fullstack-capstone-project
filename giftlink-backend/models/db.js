/*jshint esversion: 8 */
// db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL;
const dbName = "giftdb";

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    try {
        // Task 1: Connect to MongoDB
        await client.connect();

        // Task 2: Connect to database giftdb and store in variable dbInstance
        dbInstance = client.db(dbName);

        // Task 3: Return the database instance
        return dbInstance;

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Re-throw the error to be handled by the caller
    }
}

export default connectToDatabase;