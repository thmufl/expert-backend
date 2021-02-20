import express, { Request, Response, NextFunction } from "express";
import logger from "../middleware/logger";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

import Expert, { IExpert, validate } from "../models/expert";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	let experts = await Expert.find();
	res.json(experts);
});

// router.get("/find", async (req, res) => {
// 	const name = new RegExp(`${req.query.skill || ""}`, "i");
// 	const status = req.query.status;
// 	let experts: IExpert[];

// 	if (status && status !== "any") {
// 		experts = await Expert.find({
// 			skills: {
// 				$elemMatch: {
// 					name,
// 					status
// 				},
// 			},
// 		});
// 	} else {
//         experts = await Expert.find({ "skills.name": name })
//     }
// 	res.json(experts);
// });

// Continue on: https://stackoverflow.com/questions/15117030/how-to-filter-array-in-subdocument-with-mongodb
router.get("/find", async (req, res) => {
	const skill = req.query.skill;
	const status = req.query.status;
	let experts: IExpert[];

	if (status && status !== "any") {
		experts = await Expert.find(
            { "skills.status": status, $text: { $search: skill as string }},
            { score: { $meta: "textScore" }}).sort( { score: { $meta: "textScore" }});
        experts.forEach(expert => {
            expert.skills = expert.skills.filter(skill => skill.status === status);
        });
	} else {
		experts = await Expert.find(
            { $text: { $search: skill as string }},
            { score: { $meta: "textScore" }}).sort( { score: { $meta: "textScore" }});
	}
	res.json(experts);
});

router.get("/:id", async (req, res) => {
	const expert = await Expert.findById(req.params.id);
	res.json(expert);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const expert = await Expert.create(req.body);
	res.json(expert);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const expert = await Expert.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	);
	res.json(expert);
});

router.delete("/:id", async (req, res) => {
	const result = await Expert.findByIdAndDelete(req.params.id);
	res.json(result);
});

export default router;
