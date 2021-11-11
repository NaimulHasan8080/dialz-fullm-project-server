const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nsqce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect()
        console.log("connect to database");
        const database = client.db('swiss-eagle');
        const serviceCollection = database.collection('service');
        const reviewCollection = database.collection('review');
        const ordersCollection = database.collection('orders')
        const usersCollection = database.collection('users')


        //post api for services insert me
        app.post('/review', async (req, res) => {
            const service = req.body;
            const result = await reviewCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


        // GET API all service for show data me
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // GET API all service for show data me
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });


        // GET Single Service id me
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })



        // Add Orders API me
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })
        // Add users API me
        app.post('/users', async (req, res) => {
            const order = req.body;
            const result = await usersCollection.insertOne(order);
            res.json(result);
        })

        // show my orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        });


        // update status
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedOrder.status,
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        // cancel an order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
        })

        // dynamic api for update products
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            console.log('load user with id: ', id);
            res.send(order);
        })


    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running swiss eagle server')
})
app.listen(port, () => {
    console.log('listening on port', port);
});

