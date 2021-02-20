import mongoose from "mongoose";
import Joi from "Joi";

import User, { userSchema, IUser } from "./user";
import Organisation, { IOrganisation } from "./organisation";

export interface IContract extends Document {
	name: String;
	description: String;
  contractor: { person: IUser, organisation: IOrganisation };
  contractee: { person: IUser, organisation: IOrganisation };
	status: String;
}

export const contractSchema = new mongoose.Schema({
	name: String,
	description: String,
	contractor: {
    person: {
			type: mongoose.Types.ObjectId,
			ref: User,
      required: true
		},
		organisation: {
			type: mongoose.Types.ObjectId,
			ref: Organisation,
		},
		
	},
	contractee: {
    person: {
			type: mongoose.Types.ObjectId,
			ref: User,
      required: true
		},
		organisation: {
			type: mongoose.Types.ObjectId,
			ref: Organisation,
		}
	},
});

export const validate = (contract: IContract) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(128).required(),
		description: Joi.string().max(2048),
		status: Joi.string().required().valid("applied", "active", "suspended"),
	});
	return schema.validate(contract);
};

export default mongoose.model("Contract", contractSchema);
