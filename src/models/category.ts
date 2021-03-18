import mongoose, { Schema, Document } from "mongoose";
import Joi from "Joi";

export interface ICategory extends Document {
	name: String;
	description: String;
	slug: String;
	children: ICategory[]
}

const categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	slug: {
		type: String,
		index: true,
	},
	children: [{
		type: mongoose.Types.ObjectId,
		ref: "Category"
	}]
});

// Helper function (TBD: refactor)
const slugify = (s: String) => {
	const a =
		"àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
	const b =
		"aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
	const p = new RegExp(a.split("").join("|"), "g");

	return s
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
		.replace(/&/g, "-and-") // Replace & with 'and'
		.replace(/[^\w\-]+/g, "") // Remove all non-word characters
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
};

categorySchema.pre("save", async function (next) {
	const category = this as ICategory;
	category.slug = slugify(category.name);
	next();
});

export const validate = (category: ICategory) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(128).required(),
		description: Joi.string().max(4096),
		children: Joi.array().max(1024)
	});
	return schema.validate(category);
};

export default mongoose.model<ICategory>("Category", categorySchema);
