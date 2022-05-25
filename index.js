const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wukz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "UnAuthorized access" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();

    const projectsCollection = client
      .db("partsManufacturer")
      .collection("projects");
    const productsCollection = client
      .db("partsManufacturer")
      .collection("products");
    const usersCollection = client.db("partsManufacturer").collection("users");
    const reviewsCollection = client
      .db("partsManufacturer")
      .collection("reviews");

    app.get("/projects", async (req, res) => {
      const query = {};
      const cursor = await projectsCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = await productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:_id", async (req, res) => {
      // console.log(req.params._id)
      const query = req.params._id;
      const cursor = await productsCollection.find({ query });
      const product = await cursor.toArray();
      // console.log(product);
      res.send(product);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = await usersCollection.find({ email: email });
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = await reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await usersCollection.find(query);
      const users = cursor.toArray();
      res.send(users);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const users = await usersCollection.insertOne(user);
      res.send(users);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("manufacturer website server is running");
});

app.listen(port, () => {
  console.log("listen on port", port);
});
