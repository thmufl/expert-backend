import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import skillSchema, { ISkill } from "./skill";

export interface IExpert extends Document {
	name: String;
	location: String;
	skills: ISkill[];
}

const expertSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	skills: [skillSchema],
});

export const validate = (expert: IExpert) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(128).required(),
		location: Joi.string().min(2).max(128).required(),
		skills: Joi.array().max(100),
	});
	return schema.validate(expert);
};

export default mongoose.model<IExpert>("Expert", expertSchema);
