import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";

export interface IMembership extends Document {
	user: IUser;
	status: String;
}

const membershipSchema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: User,
	},
	status: {
		type: String,
		enum: ["applied", "active", "suspended"],
		requred: true,
        default: "applied"
	},
});

export const validate = (membership: IMembership) => {
	const schema = Joi.object({
		user: Joi.string().required(),
		status: Joi.string().required().valid("applied", "active", "suspended"),
	});
	return schema.validate(membership);
};

export default membershipSchema;
