import { deleteUser as deleteUserDB, getUserByEmail } from "../utils/DBComponent.js";
import bcrypt from "bcrypt";

/**
 * Delete a user
 * @param {String} req.body.email - Required
 * @param {String} req.body.password - Required
 */
export async function deleteUser(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.email || !req.body.password) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	try {
		const user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}

		const validPassword = await bcrypt.compare(req.body.password, user.user_password);
		if (!validPassword) {
			res.status(400).send({ message: "Invalid password" });
			return;
		}

		await deleteUserDB(user.id);
		res.status(200).send({ message: "User deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error deleting user" });
	}
}
