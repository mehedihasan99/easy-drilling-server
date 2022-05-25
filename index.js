const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4kacx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const ProductCollection = client.db("easy_drilling").collection("products");
    const purchaseCollection = client
      .db("easy_drilling")
      .collection("purchases");
    const reviewCollection = client.db("easy_drilling").collection("reviews");
    const userCollection = client.db("easy_drilling").collection("users");
    //load all data from the database
    app.get("/product", async (req, res) => {
      const query = {};
      const products = await ProductCollection.find(query).toArray();
      res.send(products);
    });
    // put
    app.put("/user/email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    //post
    app.post("/purchase", async (req, res) => {
      const purchaseProduct = req.body;
      const result = await purchaseCollection.insertOne(purchaseProduct);
      res.send(result);
    });
    // get all purchase(order)
    app.get("/purchase", async (req, res) => {
      const query = {};
      const purchases = await purchaseCollection.find(query).toArray();
      res.send(purchases);
    });
    // post :received data from the client and send to database
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    //load all data from the database
    app.get("/review", async (req, res) => {
      const query = {};
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });
  } finally {
  }
}
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Easy drilling listening on port ${port}`);
});
run().catch(console.dir);
