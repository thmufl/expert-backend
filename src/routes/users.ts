import express, { Request, Response } from "express";

import _ from "lodash";
import bcrypt from "bcrypt";

import admin from "../middleware/admin";
import auth from "../middleware/auth";
import User, { validate } from "../models/user";

const router = express.Router();

router.get("/", [auth, admin], async (req: Request, res: Response) => {
	let users = await User.find().select("-password").sort("name");
	res.json(users);
});

router.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.params.user).select("-password")
	res.json(user);
});


router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id).select("-password");
	res.json(user);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
	user = await User.create(user);
    const token = user.generateAuthToken();
    res.header("x-auth-token", token);
	res.json(_.pick(user, ["_id", "name", "email", "isAdmin"]));
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	);
	res.json(user);
});

router.delete("/:id", async (req, res) => {
	const result = await User.findByIdAndDelete(req.params.id);
	res.json(result);
});

router.get("/find/:name", async (req, res) => {
	const regex = new RegExp(`^${req.params.name}`, "i");
	const users = await User.find({ name: regex }).select("-password");
	res.json(users);
});

export default router;
