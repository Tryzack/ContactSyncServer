import { updateUserEmail as updateUserDB, getUserByEmail } from "../utils/DBComponent.js";
import bcrypt from "bcrypt";

export async function updateUserEmail(req, res) {
	if (!req.body.oldEmail || !req.body.newEmail || !req.body.password) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!regex.test(req.body.newEmail)) {
		res.status(400).send({ message: "Invalid email format" });
		return;
	}
	try {
		const user = await getUserByEmail(req.body.oldEmail);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}

		const validPassword = await bcrypt.compare(req.body.password, user.user_password);
		if (!validPassword) {
			res.status(400).send({ message: "Invalid password" });
			return;
		}

		await updateUserDB(user.id, req.body.newEmail);
		res.status(200).send({ message: "User updated" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error updating user" });
	}
}
