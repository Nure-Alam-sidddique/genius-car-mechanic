const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;

// middleWear
app.use(cors());
app.use(express.json());

// database Connect
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrqkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log("connect to database");
        const database = client.db('carMechanic');
      const serviceCollection = database.collection('services');
      
      // GET API
      app.get('/services', async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })
        
      //  GET SiNGLe API
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.json(result);

      })
        //  POST API
      app.post('/services', async (req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        // console.log(result);
        res.json(result);
        
        })

        //  DELETE API
      app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.deleteOne(query);
        res.json(result);
        })

        
    }
    finally {
    //   await  client.close();
    }
}
run().catch(console.dir);

app.get('/users', (req, res) => {
    res.send("hello MongoDB");
})

app.listen(port, () => {
    console.log(`The listen port  ${port}`);
})