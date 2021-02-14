import express from "express";
import Person from "../models/person";
import Organisation from "../models/organisation";

const router = express.Router();

router.get("/", async (req, res) => {
  let persons = await Person.find();
  res.json(persons);
});

router.get("/:id", async (req, res) => {
  const person = await Person.findById(req.params.id).populate("skills.definition");
  res.json(person);
});

router.get("/:id/organisations", async (req, res) => {
  const organisations = await Organisation.find({members: req.params.id});
  res.json(organisations);
});

router.post("/", async (req, res) => {
  const person = await Person.create(req.body);
  res.json(person);
});

router.put("/:id", async (req, res) => {
  const person = await Person.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json(person);
});

router.delete("/:id", async (req, res) => {
  const result = await Person.findByIdAndDelete(req.params.id);
  res.json(result);
});

router.get("/find/:name", async (req, res) => {
    const regex = new RegExp(`^${req.params.name}`, "i");
    const persons = await Person.find({ name: regex });
    res.json(persons);
});

export default router;
