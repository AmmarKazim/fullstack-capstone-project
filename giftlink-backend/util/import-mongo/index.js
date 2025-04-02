// index.js
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// MongoDB connection URL with authentication options
dotenv.config();
let url = `${process.env.MONGO_URL}`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let filename = join(__dirname, 'gifts.json');
const dbName = 'giftdb';
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected successfully to server");

        // database will be created if it does not exist
        const db = client.db(dbName);

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = await collection.find({});
        let documents = await cursor.toArray();

        if(documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log("Gifts already exists in DB")
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

loadData();

export default {
    loadData,
  };
