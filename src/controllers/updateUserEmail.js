import { updateUserEmail as updateUserDB, getUserById, getUserByEmail } from "../utils/DBComponent.js";
import bcrypt from "bcrypt";

/**
 * Update user email
 * @param {String} req.body.newEmail - Required
 * @param {String} req.body.password - Required
 */
export async function updateUserEmail(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}

	if (!req.body.newEmail) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!regex.test(req.body.newEmail)) {
		res.status(402).send({ message: "Invalid email format" });
		return;
	}
	try {
		const user = await getUserById(req.session.userId);
		if (!user) {
			res.status(401).send({ message: "User does not exist" });
			return;
		}
		// valid if email already exists
		const userByEmail = await getUserByEmail(req.body.newEmail);
		if (userByEmail) {
			res.status(403).send({ message: "Email already exists" });
			return;
		}

		await updateUserDB(user.id, req.body.newEmail);
		res.status(200).send({ message: "User updated" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error updating user" });
	}
}
