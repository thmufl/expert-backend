import express from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 8001;

process.env.MONGO_DB_URL = "mongodb://localhost:27017/expert";
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Connected to MongoDb...");
});

const personSchema = new Schema({
  name: String,
  description: String,
  tags: [String],
});

const Person = mongoose.model("Person", personSchema);

/*
Person.insertMany([
  new Person({
    name: "Carlos Sanchez",
    description:
      "Carlos is an experienced spanish translator. He lives in Zürich",
    tags: ["spanish-german interpreter", "german-spanish translator"],
  }),
  new Person({
    name: "Anne Dupont",
    description: "Anne is an experienced french translator. She lives Horgen",
    tags: ["french-german interpreter", "german-french translator"],
  }),
  new Person({
    name: "Peter Smith",
    description:
      "Peter is an experienced british as well as american english interpreter. He lives Gockhausen",
    tags: [
      "english-german interpreter",
      "german-english interpreter",
      "business english",
    ],
  }),
]);
*/

const createPerson = async (person: any) => {
  const result = await Person.create(person);
  return result?.toJSON();
};

const readPerson = async (id: string) => {
  const result = await Person.findOne({ _id: id });
  return result?.toJSON();
};

const updatePerson = async (person: any) => {
  const result = await Person.findOneAndUpdate({ _id: person._id }, person, {
    new: true,
  });
  return result?.toJSON();
};

const deletePerson = async (id: string) => {
  const result = await Person.deleteOne({ _id: id });
  return result;
};

const listPersons = async () => {
  const result = await Person.find({});
  return result;
};

const findPerson = async (pattern: string) => {
  const regex = new RegExp(pattern, "i");
  const result = await Person.find().or([
    { name: regex },
    { tags: regex },
    { description: regex },
  ]);
  return result;
};

/*
readPerson("601c2791e3e4335e44306d9a").then((result) => console.log("read 0", result));

findPerson("Anne Dup").then((result) => console.log("find 0", result));
findPerson("bus").then((result) => console.log("find 1", result));
findPerson("Gock").then((result) => console.log("find 2", result));

updatePerson(
  {
    tags: [ 'french-german interpreter', 'german-french translator' ],
    _id: "601c2791e3e4335e44306d99",
    name: 'Anne Dupont',
    description: 'Anne is an experienced french translator. She lives Stäfa',
}).then((result) => console.log("update 0", result));

createPerson(
  {
    tags: [ 'italian-german interpreter', 'french-italian translator' ],
    name: 'Carla Boffi',
    description: 'Carla is an experienced italian translator. She lives Lugano',
}).then((result) => console.log("create 0", result));

deletePerson("601c3a0b9e870960a621144a").then((result) => console.log("delete 0", result));
*/

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.get("/api/person", async (req, res) => {
  const persons = await listPersons();
  res.json(persons);
});

app.get("/api/person/:id", async (req, res) => {
  const person = await readPerson(req.params.id);
  res.json(person);
});

app.get("/api/person/find/:pattern", async (req, res) => {
  const pattern = req.params.pattern;
  if (pattern.length < 2) {
    res.status(400).send("Pattern must be at least 2 characters");
    return;
  }
  const persons = await findPerson(pattern);
  res.json(persons);
});

app.post("/api/person", async (req, res) => {
  const person = await updatePerson(req.body);
  res.json(person)
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
