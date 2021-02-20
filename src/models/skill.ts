import { Schema, Document } from "mongoose";
import Joi from "Joi";

export interface ISkill extends Document {
	name: String;
	status: String;
}

const skillSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["unconfirmed", "confirmed", "suspended"],
		required: true,
		default: "unconfirmed"
	},
});

export const validate = (skill: ISkill) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(256).required(),
		status: Joi.string().required().valid("unconfirmed", "confirmed", "suspended"),
	});
	return schema.validate(skill);
};

export default skillSchema;