const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
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

        const usersCollection = client.db('job-task').collection('users')
        const recipesCollection = client.db('job-task').collection('recipe');

        // Get user by email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // Save user in database
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const option = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(query, updateDoc, option)
            // console.log(result);
            res.send(result)
        })

        // Get all Recipes
        app.get("/recipes", async (req, res) => {
            const result = await recipesCollection.find().toArray()
            res.send(result)
        })

        // Get Single Recipe
        app.get("/recipe/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await recipesCollection.findOne(query)
            res.send(result)
        })

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