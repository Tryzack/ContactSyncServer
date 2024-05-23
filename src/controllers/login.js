import bcrypt from "bcrypt";
import { getUserByEmail } from "../utils/DBComponent.js";

export async function login(req, res) {
	if (!req.body.email || !req.body.password) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		let user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(404).send({ message: "User not found" });
			return;
		}
		if (await bcrypt.compare(req.body.password, user.user_password)) {
			req.session.userId = user.id;
			res.send({ message: "Logged in" });
		} else {
			res.status(401).send({ message: "Unauthorized" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Internal server error" });
	}
}
