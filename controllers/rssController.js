import axios from 'axios';
import Parser from 'rss-parser';
import { RSSFeed } from '../models/RSSFeed.js';
import { Preview } from '../models/Preview.js';
import { TodaysPost } from '../models/TodaysPost.js';
import { DailyScan } from '../models/DailyScan.js';
import {Setting} from '../models/Setting.js'; 


const openaiApiKey = process.env.OPENAI_API_KEY;
const parser = new Parser();




export const addRSSFeed = async (req, res) => {
    try {
        const { url } = req.body;

        // Check if the URL is already in the database
        const existingFeed = await RSSFeed.findOne({ url });
        if (existingFeed) {
            return res.status(400).json({ message: 'RSS feed URL already exists' });
        }

        // Fetch the URL content
        const response = await axios.get(url);

        // Check if the response status is OK and data exists
        if (response.status !== 200 || !response.data) {
            return res.status(400).json({ message: 'Invalid RSS feed url' });
        }

        // Parse the RSS feed
        let feed;
        try {
            feed = await parser.parseString(response.data);
        } catch (parseError) {
            console.error('Error parsing RSS feed:', parseError);
            return res.status(400).json({ message: 'Invalid RSS feed format' });
        }

        

        // Save the valid RSS feed to the database
        const newFeed = new RSSFeed({ url, valid: true });
        await newFeed.save();

        res.status(201).json({ message: 'RSS feed added successfully', feed: newFeed });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};





// Get all RSS feeds
export const getRSSFeed = async (req, res) => {
    try {
        const feeds = await RSSFeed.find();
        res.status(200).json(feeds);
    } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an RSS feed by ID
export const deleteRSSFeed = async (req, res) => {
    try {
        const { id } = req.params;

        const feed = await RSSFeed.findByIdAndDelete(id);
        if (!feed) {
            return res.status(404).json({ message: 'RSS feed not found' });
        }

        res.status(200).json({ message: 'RSS feed deleted successfully' });
    } catch (error) {
        console.error('Error deleting RSS feed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check DailyScan status
export const checkDailyScanStatus = async (req, res) => {
    try {
      const today = new Date().setHours(0, 0, 0, 0);
      const scan = await DailyScan.findOne({ date: today });
  
      if (!scan) {
        // If no scan document exists, respond that the news needs to be reloaded
        return res.json({ message: 'No scan today. Reload news.' });
      } else {
        // If scan document exists, respond with the status
        return res.json({ message: 'News for today already reloaded.', scan });
      }
    } catch (error) {
      console.error('Error checking DailyScan:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

 // Delete all DailyScan data
export const deleteAllDailyScans = async (req, res) => {
    try {
        const result = await DailyScan.deleteMany({}); // Delete all documents in the DailyScan collection

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No DailyScan records found to delete.' });
        }

        return res.json({ message: `Successfully deleted ${result.deletedCount} DailyScan records.` });
    } catch (error) {
        console.error('Error deleting DailyScan records:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
  

export const reloadArticles = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        let scan = await DailyScan.findOne({ date: today });

        if (!scan) {
            scan = new DailyScan({ date: today, reloaded: true });
            await scan.save();
        } else if (scan.reloaded && !req.query.force) {
            return res.status(400).json({ message: 'Articles have already been loaded today' });
        }

        await Preview.deleteMany({});

        const feeds = await RSSFeed.find({ valid: true });
        let previews = [];

        for (let feed of feeds) {
            const { items } = await parser.parseURL(feed.url);
            items.forEach(item => {
                if (item && item.link) {
                    previews.push({
                        title: item.title || 'No title',
                        content: item.contentSnippet || item.content || 'No content',
                        link: item.link,
                    });
                } else {
                    console.warn('Invalid item or missing link:', item);
                }
            });
        }

        await Preview.insertMany(previews);

        const setting = await Setting.findOne();
        const context = setting ? setting.context : "articles relevant to executives...";

        // First Prompt to select top 3 articles
        const previewMessages = [
            {
                role: 'system',
                content: `You act as an editor of the newsfeed and your job is to pick ${context}. You will be given article previews. When responding, list the top 3 article IDs as a comma-separated list.`,
            },
            {
                role: 'user',
                content: previews.map((p, idx) => `ID ${idx + 1}: ${p.content}`).join('\n'),
            },
        ];

        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo',
                messages: previewMessages,
                max_tokens: 500,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
            }
        );

        const selectedIDs = openaiResponse.data.choices[0].message.content.trim().split(',').map(id => parseInt(id.trim()));

        const topPreviews = selectedIDs.map(id => previews[id - 1]);

// Refined prompt to ensure LinkedIn posts match article titles, links, and include hashtags
const postMessages = [
    {
        role: 'system',
        content: `You act as an editor of the newsfeed and your job is to create LinkedIn posts. Ensure that the content aligns with the article titles and links provided. Each post should be concise, engaging, and include 3-5 relevant hashtags.`,
    },
    {
        role: 'user',
        content: topPreviews.map((p, idx) => `Title: ${p.title}\nLink: ${p.link}`).join('\n\n'),
    },
];

const postResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
        model: 'gpt-4-turbo',
        messages: postMessages,
        max_tokens: 1000,
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
        },
    }
);

const posts = postResponse.data.choices[0].message.content.trim().split('\n\n').map((p, idx) => ({
    ...topPreviews[idx],
    content: p,
}));

await TodaysPost.updateOne({}, { posts, createdAt: Date.now() }, { upsert: true });

res.status(200).json({ message: 'Articles reloaded and processed successfully', posts });

    } catch (error) {
        console.error('Error reloading articles:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


