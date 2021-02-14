import express from "express";
import mongoose from "mongoose";
import config from "config";

import users from "./routes/users";
import organisations from "./routes/organisations";
import persons from "./routes/persons";
import skillDefinitions from "./routes/skillDefinitions";
import auth from "./routes/auth";

// export expert_jwtPrivateKey=mySecureKey
if(!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/users", users);
app.use("/api/organisations", organisations);
app.use("/api/persons", persons);
app.use("/api/skills/definitions", skillDefinitions);
app.use("/api/auth", auth);


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

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
