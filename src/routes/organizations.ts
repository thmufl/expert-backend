import express from "express";
import Organization, { validate } from "../models/organization";

const router = express.Router();

router.get("/", async (req, res) => {
	let { bodyLimit, pageLimit } = req.params;
	let organizations = await Organization.find().limit(bodyLimit ? parseInt(bodyLimit) : 10);
	res.status(200).json(organizations);
});

router.get("/:id", async (req, res) => {
	const organization = await Organization.findById(req.params.id);
	res.json(organization);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	const organization = await Organization.create(req.body);
	res.json(organization);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	const organization = await Organization.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	);
	res.json(organization);
});

router.delete("/:id", async (req, res) => {
	const result = await Organization.findByIdAndDelete(req.params.id);
	res.json(result);
});

router.get("/find/:name", async (req, res) => {
	const regex = new RegExp(`^${req.params.name}`, "i");
	const organizations = await Organization.find({ name: regex });
	res.json(organizations);
});

export default router;
