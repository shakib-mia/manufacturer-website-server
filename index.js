const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wukz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const projectsCollection = client
      .db("partsManufacturer")
      .collection("projects");

    app.get("/projects", async (req, res) => {
      const query = {};
      const cursor = await projectsCollection.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
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
