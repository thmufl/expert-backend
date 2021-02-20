import express from "express";
import Joi from "Joi";
import _ from "lodash";
import bcrypt from "bcrypt";
import User from "../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
	
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	console.log(req.body.email, user);
	if (!user) return res.status(400).send("Invalid email or password.");

	const validPassword = await bcrypt.compare(
		req.body.password,
		user.password!
	);
	if (!validPassword)
		return res.status(400).send("Invalid email or password.");

	const token = user.generateAuthToken();
	user.password = undefined;
	res.json({ user, token });
});

const validate = function (req: Request) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(req.body);
};

export default router;
