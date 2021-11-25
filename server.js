const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGODB_URL;


async function createconnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("mongodb connected");
  return client;
}
app.get('/', (req, res) => {
  res.send("hello contact");
});

app.post('/contact', async (req, res) => {
  try {
    const client = await createconnection();
    const contact = await client
      .db("contacts")
      .collection("contacts")
      .insertOne(req.body);

    res.send(contact);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.get("/contact", async (req, res) => {
  try {
    const client = await createconnection();
    const contact = await client
      .db("contacts")
      .collection("contacts")
      .find()
      .toArray();

    res.send(contact);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.put("/contact/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await createconnection();
    const contact = await client
      .db("contacts")
      .collection("contacts")
      .updateOne({ id: id }, { $set: req.body });

    res.send(contact);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.delete("/contact/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await createconnection();
    const contact = await client
      .db("contacts")
      .collection("contacts")
      .deleteOne({ id: id });

    res.send(contact);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(PORT, (req, res) => {
  console.log("server is running");
});
