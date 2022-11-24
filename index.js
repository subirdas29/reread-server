const express = require('express');
const cors = require('cors');
const port = process.env.PORT|| 5000;
const app = express()
require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){

    try{
       
        const categoriesCollection = client.db('reRead').collection('categories')
        const usersCollection = client.db('reRead').collection('books')
      
        app.get('/categories',async(req,res)=>{
            const query = {}
            const result = await categoriesCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })
        app.get('/categories/:id',async(req,res)=>{
           
            const id = req.params.id

            const query = {category_id:id}
            const result = await usersCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        
       

    }
    finally{

    }

}
run().catch(console.dir);


app.get('/',async(req,res)=>{
res.send('reread server is running')

})


app.listen(port,()=>console.log(`Reread running on port ${port}`))