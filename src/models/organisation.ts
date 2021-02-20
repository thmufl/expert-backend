import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

import User, { IUser } from "./user";
import membershipSchema, { IMembership } from "./memberships";
import skillDefinition, { skillDefinitionSchema, ISkillDefinition } from "./skillDefinition";

export interface IOrganisation extends Document {
  name: string;
  description: string;
  directors: IMembership[];
  board: IMembership[];
  members: IMembership[];
  administrators: IMembership[];
  skillDefinitions: ISkillDefinition[];
}

const organisationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 128,
  },
  description: {
    type: String,
    max: 2048,
  },
  directors:[membershipSchema],
  board: [membershipSchema],
  members: [membershipSchema],
  administrators: [membershipSchema],
  skillDefinitions: [skillDefinitionSchema],
});

export const validate = (organisation: IOrganisation) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(128).required(),
    description: Joi.string().max(2048),
    directors: Joi.array().max(1e2),
    board: Joi.array().max(1e3),
    members: Joi.array().max(1e6),
    administrators: Joi.array().max(1e2),
    skillDefinitions: Joi.array().max(1e4),
  });
  return schema.validate(organisation);
};

export default mongoose.model<IOrganisation>(
  "Organisation",
  organisationSchema
);
