const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const cors = require('cors')
const port = 7001

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
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const userss = await userCollaction.deleteOne(query)
            res.send(userss)

        })

        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollaction.insertOne(newUser)
            res.send(result)

        })

        app.patch('/user/:id', async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: new ObjectId(id)
            }
            const modifyUser = req.body
            const updateUser = {
                $set: {
                    name: modifyUser.name,
                    email: modifyUser.email,
                    role: modifyUser.role
                }
            }
            const result = await userCollaction.updateOne(filter, updateUser);
            res.send(result)
        })


    } catch (error) {
        res.status(500).send({ error: error.message });
    }

    finally {
        // await client.close()
    }



}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send({ status: 'success' })
})


app.listen(port, () => {
    console.log(`server is runing on port ${port}`);

})