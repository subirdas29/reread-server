const express = require('express');
const cors = require('cors');
const port = process.env.PORT|| 5000;
const app = express()
require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){

    try{
       
        const categoriesCollection = client.db('reRead').collection('categories')
        const booksCollection = client.db('reRead').collection('books')
        const usersCollection = client.db('reRead').collection('users')
      
        app.get('/categories',async(req,res)=>{
            const query = {}
            const result = await categoriesCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })
        app.get('/categories/:id',async(req,res)=>{
           
            const id = req.params.id

            const query = {category_id:id}
            const result = await booksCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })
        app.post('/users',async(req,res)=>{
           
            const id = req.body
            const result = await usersCollection.insertOne(id)
            console.log(result)
            res.send(result)
        })

        app.get('/users/allbuyer',async(req,res)=>
        {
            const query = {role:'User'}
            const user = await usersCollection.find(query).toArray()
           res.send(user)
           
        })

      

        app.get('/users/allseller',async(req,res)=>
        {
            const query = {role:'Seller'}
            const user = await usersCollection.find(query).toArray()
           res.send(user)
          
        })

       

        app.get('/users/admin/:email',async(req,res)=>
        {
            const email = req.params.email
            const query = {email}
            const user = await usersCollection.findOne(query)
            res.send({ isAdmin :user?.role ==='admin' })
        })

        app.get('/users/seller/:email',async(req,res)=>
        {
            const email = req.params.email
            const query = {email}
            const user = await usersCollection.findOne(query)
            res.send({ isSeller :user?.role ==='Seller' })
        })

        app.delete('/users/allbuyer/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
            console.log(result)
        })
        
        app.delete('/users/allseller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
            console.log(result)
        })
        app.post('/allbooks',async(req,res)=>{
            const book = req.body
            const books = await booksCollection.insertOne(book)
            res.send(books)
        })
      
        app.get('/allbooks',async(req,res)=>{
            const email = req.query.email
           const query = {email}
            const books = await booksCollection.find(query).toArray()
            res.send(books)
        })
        app.delete('/allbooks/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await booksCollection.deleteOne(filter);
            res.send(result);
            console.log(result)
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