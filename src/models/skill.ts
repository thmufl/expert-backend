import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";
import SkillDefinition, { ISkillDefinition } from "./skillDefinition";
import User, { IUser } from "./user";

export interface ISkill extends Document {
	skillDefinition: ISkillDefinition;
	confirmedBy: IUser[];
}

const skillSchema: Schema = new Schema({
	skillDefinition: {
		type: mongoose.Types.ObjectId,
		ref: SkillDefinition,
		required: true,
	},
	confirmedBy: [
		{
			type: mongoose.Types.ObjectId,
			ref: User,
		},
	],
});

export const validate = (skill: ISkill) => {
	const schema = Joi.object({
		skillDefinition: Joi.string().required(),
		confirmedBy: Joi.array().max(1e6),
	});
	return schema.validate(skill);
};

export default skillSchema;
