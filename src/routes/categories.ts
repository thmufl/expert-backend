import express, { Request, Response, NextFunction } from "express";
import logger from "../middleware/logger";
import admin from "../middleware/admin";
import auth from "../middleware/auth";

import Category, { ICategory, validate } from "../models/category";

// Helper functions (TBD: refactor)
/*
const buildAncestors = async (id: String, parentId: String) => {
	let ancestors = [];
	try {
		const parentCategory = await Category.findOne(
			{ _id: parentId },
			{ _id: 1, name: 1, description: 1, slug: 1, children: 1 }
		).exec();
		if (parentCategory) {
			const { _id, name, description, slug } = parentCategory;
			const ancestors = [...parentCategory.ancestors];
			ancestors.unshift({ _id, name, description, slug });
			const category = await Category.findByIdAndUpdate(id, {
				$set: { ancestors },
			});
		}
	} catch (err) {
		console.log(err.message);
	}
};

export const buildHierarchyAncestors = async (
	categoryId: String,
	parentId: String
) => {
	if (categoryId && parentId) buildAncestors(categoryId, parentId);
	const result = await Category.find({ parent: categoryId }).exec();
	if (result) {
		result.forEach((doc) => {
			buildHierarchyAncestors(doc._id, categoryId);
		});
	}
};
*/

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	let categories = await Category.find();
	res.json(categories);
});

router.get("/:id", async (req, res) => {
	const category = await Category.findById(req.params.id).populate("children");
	res.json(category);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const category = await Category.create(req.body);
	res.status(201).json(category);
});

router.post("/:id/children", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const child = await Category.create(req.body);
	await Category.updateOne(
		{ _id: req.params.id },
		{
			$addToSet: { children: child._id },
		}
	);
	res.status(201).json(child);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });

	const category = await Category.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	);
	res.json(category);
});

router.delete("/:id", async (req, res) => {
	await Category.updateMany({ $pull: { children: req.params.id }});
	const result = await Category.findByIdAndDelete(req.params.id);
	res.json(result);
});

export default router;
