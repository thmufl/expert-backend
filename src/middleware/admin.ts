import { Request, Response, NextFunction } from "express";
import User from "../models/user";

const admin = (req: Request, res: Response, next: NextFunction) => {
	const user = new User(req.params.user);
	if (!user.isAdmin) return res.status(403).send("Access denied.");
	next();
};

export default admin;
