import express from "express";
import SkillDefinition, { validate } from "../models/skillDefinition";

const router = express.Router();

router.get("/", async (req, res) => {
  const skillDefinitions = await SkillDefinition.find();
  res.json(skillDefinitions);
});

router.get("/:id", async (req, res) => {
  const skillDefinition = await SkillDefinition.findById(req.params.id);
  res.json(skillDefinition);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
  const skillDefinition = await SkillDefinition.create(req.body);
  res.json(skillDefinition);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
  const skillDefinition = await SkillDefinition.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json(skillDefinition);
});

router.delete("/:id", async (req, res) => {
  const result = await SkillDefinition.findByIdAndDelete(req.params.id);
  res.json(result);
});

router.get("/find/:name", async (req, res) => {
    const regex = new RegExp(`^${req.params.name}`, "i");
    const skillDefinitions = await SkillDefinition.find({ name: regex });
    res.json(skillDefinitions);
});

export default router;
