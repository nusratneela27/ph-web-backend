const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("connected to MongoDB");

        const db = client.db('job-task');
        const recipesCollection = db.collection('recipe');

        // Save recipes in database
        app.post("/add-recipes", async (req, res) => {
            const recipe = req.body
            const result = await recipesCollection.insertOne(recipe)
            res.send(result)
        })

    } finally {
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})