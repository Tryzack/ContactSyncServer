import { updateUserPassword as updateUserDB, getUserByEmail } from "../utils/DBComponent.js";
import bcrypt from "bcrypt";

export async function updateUserPassword(req, res) {
	if (!req.body.email || !req.body.oldPassword || !req.body.newPassword) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	if (req.body.newPassword === null || req.body.newPassword === "" || req.body.newPassword === undefined || req.body.newPassword.length < 8) {
		res.status(400).send({ message: "Invalid password" });
		return;
	}
	try {
		const user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}

		const validPassword = await bcrypt.compare(req.body.oldPassword, user.user_password);
		if (!validPassword) {
			res.status(400).send({ message: "Invalid password" });
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
