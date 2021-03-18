import express, { Request, Response, NextFunction } from "express";
import logger from "../middleware/logger";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

import UserProfile, { validate } from "../models/userProfile";
import Organization from "../models/organization";

const router = express.Router();

router.get(
	"/",
	[auth, admin],
	async (req: Request, res: Response, next: NextFunction) => {
		let profiles = await UserProfile.find();
		res.json(profiles);
	}
);

router.get("/:id", async (req, res) => {
	const profile = await UserProfile.findById(req.params.id)
		.populate({
			path: "user",
			select: "-password"
		})
		.populate("skills");
	res.json(profile);
});

// router.get("/:id/organisations", async (req, res) => {
//   const organisations = await Organisation.find({members: req.params.id});
//   res.json(organisations);
// });

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const profile = await UserProfile.create(req.body);
	res.json(profile);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const profile = await UserProfile.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	);
	res.json(profile);
});

router.delete("/:id", async (req, res) => {
	const result = await UserProfile.findByIdAndDelete(req.params.id);
	res.json(result);
});

router.get("/find/:name", async (req, res) => {
	const regex = new RegExp(`^${req.params.name}`, "i");
	const profiles = await UserProfile.find({ name: regex });
	res.json(profiles);
});

export default router;
