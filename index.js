const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = process.env.PROT || 7001

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@cluster0.tcghrel.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



const run = async () => {

    try {

        await client.connect();
        await client.db('admin').command({ ping: 1 })
        console.log('Pinged your deployment. You successfully connected to MongoDB!');

        const db = client.db('express-simplecrud')
        const userCollaction = db.collection('user')

        app.get('/user', async (req, res) => {
            const cursor = userCollaction.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const users = await userCollaction.findOne(query)
            res.send(users)

        })


    }

    finally {
        // await client.close()
    }



}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('simple crud server')
})


app.listen(port, () => {
    console.log(`server is runing on port ${port}`);

})