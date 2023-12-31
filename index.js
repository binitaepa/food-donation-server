const express = require('express');
const cors = require('cors');
 require('dotenv').config();

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// user= food-sharing
// pass= ssrVUp55DNQ24G9f



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2avmfb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const featuresCollection=client.db('foodShare').collection('feature');
    const collection=client.db('foodShare').collection('collection');
    app.get('/feature',async(req,res)=>{
        const cursor =featuresCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    })
    app.get('/feature/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await featuresCollection.findOne(query);
        res.send(result);
    })
    app.patch('/feature/:id',async(req,res)=>{
        
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const foodADD=req.body;
        console.log(foodADD)
        const updateDoc = {
          $set: {
              notes: foodADD.notes,
              money:foodADD.money

          },
      };
      const result = await featuresCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.get('/collection', async (req, res) => {
        const cursor = collection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/collection',async(req,res)=>{
        // console.log('token',req.cookies.token)
        console.log(req.query.email);
        console.log('user in the valid token',req.user)
       
                let query={};
                if(req.query?.email){
                    query= {email:req.query.email}
                }
                const result =await collection.find().toArray();
               res.send(result);
            })
    app.post('/collection', async (req, res) => {
        const newFood = req.body;
        console.log(newFood);
        const result = await collection.insertOne(newFood);
        res.send(result);
    })
    app.patch('/collection/:id', async (req, res) => {
        const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const updatedFood=req.body;
      console.log(updatedFood)
      const updateDoc = {
        $set: {
            foodstatus: updatedFood.foodstatus
        },
    };

      

        const result = await collection.updateOne(filter, updateDoc);
        res.send(result);
    })
    app.delete('/collection/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const query={_id:new ObjectId(id)};
        const result= await collection.deleteOne(query);
        res.send(result);
  
      })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Food server is running')
})

app.listen(port, () => {
    console.log(`Food is running on port: ${port}`)
})