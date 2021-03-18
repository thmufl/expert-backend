import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

export interface ISkillDefinition extends Document {
  name: string;
  status: String;
}

export const skillDefinitionSchema = new Schema({
  name: {
    type: String,
    min: 5,
    max: 255,
    unique: true
  },
  status: {
		type: String,
		enum: ["proposed", "active", "suspended"],
		required: true,
    default: "proposed"
	},
});

export const validate = (skillDef: ISkillDefinition) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
		status: Joi.string().required().valid("proposed", "active", "suspended"),
  });
  return schema.validate(skillDef);
};

export default mongoose.model<ISkillDefinition>("SkillDefinition", skillDefinitionSchema);
