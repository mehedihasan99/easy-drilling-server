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
    //load all data from the database
    app.get("/product", async (req, res) => {
      const query = {};
      const products = await ProductCollection.find(query).toArray();
      res.send(products);
    });
    //post
    app.post("/purchase", async (req, res) => {
      const purchaseProduct = req.body;
      const result = await purchaseCollection.insertOne(purchaseProduct);
      res.send(result);
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
