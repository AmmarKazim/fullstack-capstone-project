import dotenv from 'dotenv';
import express, { json } from 'express';
import axios from 'axios';
import logger from '../giftlink-backend/logger.js'; // Adjust the path if necessary
import expressPino from 'express-pino-logger';
import natural from 'natural';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(expressPino({ logger }));

// Define the sentiment analysis route
app.post('/sentiment', async (req, res) => {
    const { sentence } = req.body; // Changed from req.query to req.body

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer('English', stemmer, 'afinn');

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = 'neutral';

        if (analysisResult < 0) {
            sentiment = 'negative';
        } else if (analysisResult > 0.33) {
            sentiment = 'positive';
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);
        // Responding with the sentiment analysis result
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

// Start the server
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});