import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("x-auth-token");
	if (!token)
		return res.status(401).send("Access denied. No token provided.");

	try {
		const decoded = jwt.verify(
			token,
			config.get("jwtPrivateKey")
		) as string;
		req.params.user = decoded;
		next();
	} catch (exeption) {
		res.status(400).send("Invalid token.");
	}
};

export default auth;
