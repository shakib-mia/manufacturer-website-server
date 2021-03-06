const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
const cors = require("cors");
const { ObjectID } = require("bson");
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wukz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// function verifyJWT(req, res, next) {
// const authHeader = req.headers.authorization;
// if (!authHeader) {
// return res.status(401).send({ message: "UnAuthorized access" });
// }
// const token = authHeader.split(" ")[1];
// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
// if (err) {
// return res.status(403).send({ message: "Forbidden access" });
// }
// req.decoded = decoded;
// next();
// });
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
    const ordersCollection = client
      .db("partsManufacturer")
      .collection("orders");

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

    app.put("/products", async (req, res) => {
      const product = req.body;
      const products = await productsCollection.insertOne(product);
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = await productsCollection.find({ id: id });
      const product = await cursor.toArray();
      res.send(product);
    });

    app.put("/products", async (req, res) => {
      const order = req.body;
      const orders = await ordersCollection.insertOne(order);
      res.send(orders);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = await ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = await ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.put("/orders", async (req, res) => {
      const order = { order: req.body };
      const cursor = await ordersCollection.insertOne(order);
      // const orders = await cursor.toArray();
      res.send(cursor);
    });

    app.put("/orders/:email", async (req, res) => {
      const order = { order: req.body };
      const cursor = await ordersCollection.insertOne(order);
      // const orders = await cursor.toArray();
      res.send(cursor);
    });

    app.get("/orders/:email", async (req, res) => {
      const query = req.params.email;
      const cursor = await ordersCollection.find({ email: query });
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.delete("/orders/:_id", async (req, res) => {
      const query = req.params._id;
      const filter = { _id: ObjectID(query) };
      const result = await ordersCollection.deleteOne(filter);

      res.send(result);
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
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put("/users", async (req, res) => {
      const email = req.body;
      email.role = "user";
      const cursor = await usersCollection.insertOne(email);
      res.send(cursor);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put("/users/:email", async (req, res) => {
      const email = { email: req.params.email };
      const updateData = { $set: req.body };
      const options = { upsert: true };
      const cursor = await usersCollection.updateOne(
        email,
        updateData,
        options
      );
      res.send(cursor);
    });

    app.get("/users/:email", async (req, res) => {
      const query = req.params.email;
      const cursor = await usersCollection.findOne({ email: query });
      res.send(cursor);
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
