// server.js - Express/MongoDB Backend API for Lost & Found

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const path = require('path');

// ==========================================================
// 1. MONGO_URI CONFIGURATION (CRITICAL STEP)
// NOTE: REPLACE THE PLACEHOLDER STRING BELOW with your actual
// MongoDB Atlas connection URI, including your real password.
// Example: mongodb+srv://username:PASSWORD@clustername.mongodb.net/...
// ==========================================================
const MONGO_URI = "mongodb+srv://bhokaresahil4_db_user:6dMUtjDdaL8PuP4v@lf-cluster.czwdvbo.mongodb.net/?retryWrites=true&w=majority&appName=LF-Cluster"; // <<< REPLACE <db_password> HERE!

const app = express();
const PORT = 3000;
const DB_NAME = "college_lf_db"; // Your MongoDB database name
const COLLECTION_NAME = "lost_items"; // The collection storing lost items

// --- Middleware ---
// Enable CORS for all origins (important for development)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// ==========================================================
// 2. STATIC FILE SERVING (CRITICAL FIX FOR FRONTEND)
// Serves the frontend files (index.html, CSS, JS) from the 'frontend' directory.
// This allows you to open http://localhost:3000/index.html
// ==========================================================
app.use(express.static('frontend')); 


// --- MongoDB Initialization ---
const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        const database = client.db(DB_NAME);
        const lostItemsCollection = database.collection(COLLECTION_NAME);

        console.log("Successfully connected to MongoDB Atlas!");

        // --------------------------------------------------
        // API ROUTES
        // --------------------------------------------------

        // GET /api/lost_items - Fetch all reported lost items
        app.get('/api/lost_items', async (req, res) => {
            try {
                // Fetch all documents, sorting by timestamp descending (newest first)
                const items = await lostItemsCollection.find({}).sort({ timestamp: -1 }).toArray();
                res.status(200).json(items);
            } catch (error) {
                console.error("Error fetching items:", error);
                res.status(500).json({ message: "Failed to retrieve items from database." });
            }
        });

        // POST /api/lost_items - Submit a new lost item report
        app.post('/api/lost_items', async (req, res) => {
            try {
                const newItem = req.body;

                // Basic server-side validation (optional but recommended)
                if (!newItem.name || !newItem.description || !newItem.location) {
                    return res.status(400).json({ message: "Missing required fields." });
                }

                // Ensure timestamp is added/updated on the server side
                newItem.timestamp = new Date(); 
                
                const result = await lostItemsCollection.insertOne(newItem);

                res.status(201).json({ 
                    message: "Item reported successfully.", 
                    itemId: result.insertedId 
                });
            } catch (error) {
                console.error("Error inserting item:", error);
                res.status(500).json({ message: "Failed to insert item into database." });
            }
        });

        // GET /api/claims - Fetch mock claim tickets for the frontend display
        app.get('/api/claims', async (req, res) => {
            // NOTE: In a production app, this would fetch filtered data from a 'claims' collection
            // and would require user authentication.

            // Returning mock data to allow frontend rendering to work:
            const mockClaims = [
                { id: "001", itemName: "Black Backpack", itemID: "45A9", status: "verified", date: new Date().toISOString() },
                { id: "002", itemName: "Silver Key Set", itemID: "B17D", status: "pending", date: new Date(Date.now() - 86400000).toISOString() },
                { id: "003", itemName: "Green Jacket", itemID: "F90C", status: "rejected", date: new Date(Date.now() - (2 * 86400000)).toISOString() },
            ];
            res.status(200).json(mockClaims);
        });

        // --------------------------------------------------
        // Fallback Route (404)
        // --------------------------------------------------
        app.use((req, res) => {
            res.status(404).send('API endpoint not found.');
        });

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log("API is ready to handle requests.");
        });

    } catch (e) {
        console.error("CRITICAL: Failed to connect to MongoDB Atlas!", e);
        process.exit(1); // Exit if database connection fails
    }
}

run().catch(console.dir);