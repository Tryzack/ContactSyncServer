import { updateUserPassword as updateUserDB, getUserById } from "../utils/DBComponent.js";
import bcrypt from "bcrypt";

/**
 * Update user password
 * @param {String} req.body.oldPassword - Required
 * @param {String} req.body.newPassword - Required
 */
export async function updateUserPassword(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.oldPassword || !req.body.newPassword) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	if (req.body.newPassword === null || req.body.newPassword === "" || req.body.newPassword === undefined || req.body.newPassword.length < 8) {
		res.status(402).send({ message: "Invalid password" });
		return;
	}
	try {
		const user = await getUserById(req.session.userId);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}

		const validPassword = await bcrypt.compare(req.body.oldPassword, user.user_password);
		if (!validPassword) {
			res.status(403).send({ message: "Invalid password" });
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.newPassword, salt);
		await updateUserDB(user.id, password);
		res.status(200).send({ message: "User updated" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error updating user" });
	}
}
