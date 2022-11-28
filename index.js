const express = require('express');
const cors = require('cors');
const port = process.env.PORT|| 5000;
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJwt(req,res,next){
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(!authHeader)
    {
       return res.status(401).send('unauthorized')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN , function(err, decoded){
        if(err)
        {
            return res.status(403).send({message:'forbidden access'})
        }
        req.decoded = decoded
        next()
    })
} 


async function run (){

    try{
       
        const categoriesCollection = client.db('reRead').collection('categories')
        const booksCollection = client.db('reRead').collection('books')
        const usersCollection = client.db('reRead').collection('users')
        const myOrdersCollection = client.db('reRead').collection('myOrders')


       
      
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

        app.get('/jwt',async(req,res)=>{
            const email = req.query.email
            const query ={
                email:email
            }
            const user = await usersCollection.findOne(query)
            if(user)
            {
                const token = jwt.sign({email},process.env.ACCESS_TOKEN, { expiresIn:'1D'} );
                return res.send({accessToken:token})
            }
            res.status(403).send({accessToken:''})

        })

        app.get('/users/allbuyer',verifyJwt,async(req,res)=>
        {
            const query = {role:'User'}
            const user = await usersCollection.find(query).toArray()
           res.send(user)
           
        })

        app.get('/users/allseller',verifyJwt,async(req,res)=>
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

        app.delete('/users/allbuyer/:id',verifyJwt, async (req, res) => {
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        
        })
        
        app.delete('/users/allseller/:id',verifyJwt, async (req, res) => {
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
          
        })
        app.post('/allbooks',verifyJwt,async(req,res)=>{
            const book = req.body
            const books = await booksCollection.insertOne(book)
            res.send(books)
        })
      
        
        app.get('/allbooks',async(req,res)=>{
           const query = {}
            const books = await booksCollection.find(query).toArray()
            res.send(books)
            console.log(books)
        })

        app.get('/allbooks/:email',async(req,res)=>{
                const email = req.params.email
               const query = {email}
                const books = await booksCollection.find(query).toArray()
                res.send(books)
            })
        app.delete('/allbooks/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await booksCollection.deleteOne(filter);
            res.send(result);
           
        })

        app.patch('/allbooks/:id', async(req,res)=>
        {
           
           const id = req.params.id;
           const filter = ({_id:ObjectId(id)})
          
          
           const updateDoc = {
             $set: {
              advertisement:'true'
             },
           };
           const result = await booksCollection.updateOne(filter, updateDoc)
           res.send(result)
        })

        app.get('/adbooks',async(req,res)=>
        {
            const ad = req.query.advertisement
            const query = {advertisement:ad}
            const result = await booksCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/verifybookseller',async(req,res)=>{
            const query = {}
             const books = await booksCollection.find(query).toArray()
             res.send(books)
             console.log(books)
         })
 

        app.patch('/verifybookseller/:email',async(req,res)=>
        {
            const email = req.params.email;
           const filter = ({email})
           console.log(email)
   

           const updateDoc = {
             $set: {
              status:'verified'
             },
           };
           const result = await booksCollection.updateOne(filter, updateDoc)
           res.send(result)
          console.log(result)
        })
        app.patch('/users/allseller/:id',async(req,res)=>
        {
            const id = req.params.id;
           const filter = ({_id:ObjectId(id)})
      

           const updateDoc = {
             $set: {
              status:'verified'
             },
           };
           const result = await usersCollection.updateOne(filter, updateDoc)
           res.send(result)
          
        })

        app.post('/myorders',async(req,res)=>
        {
            const order = req.body;
            const result = await myOrdersCollection.insertOne(order)
            res.send(result)
        })
        app.get('/myorders',async(req,res)=>
        {
            const query= {}
            const result = await myOrdersCollection.find(query).toArray()
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