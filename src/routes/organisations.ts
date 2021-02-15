import express from "express";
import Organisation, { validate } from "../models/organisation";

const router = express.Router();

router.get("/", async (req, res) => {
  let organisations = await Organisation.find();
  res.json(organisations);
});

router.get("/:id", async (req, res) => {
  const organisation = await Organisation.findById(req.params.id).populate("members").populate("suborganisations");
  res.json(organisation);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
  const organisation = await Organisation.create(req.body);
  res.json(organisation);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
  const organisation = await Organisation.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json(organisation);
});

router.delete("/:id", async (req, res) => {
  const result = await Organisation.findByIdAndDelete(req.params.id);
  res.json(result);
});

router.get("/find/:name", async (req, res) => {
    const regex = new RegExp(`^${req.params.name}`, "i");
    const organisations = await Organisation.find({ name: regex });
    res.json(organisations);
});

export default router;
