const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j095x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('volunteer_list')
        const volunteerCollection = database.collection('services')

        const userCollection = database.collection('users')

        app.get('/services', async (req, res) => {
            const cursor = volunteerCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await volunteerCollection.findOne(query)
            res.json(result)
        })

        app.post('/addUser', async (req, res) => {
            console.log('hit the post')
            // res.send('hit')
            const query = req.body
            const users = await userCollection.insertOne(query)
            console.log(users)
            res.json(users)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello Mr Pino')
})
app.listen(port, () => {
    console.log('pino hello', port)
})

