import { getResetKeys, setResetKey } from "../utils/resetKeys.js";
import { getUserByEmail } from "../utils/DBComponent.js";

export async function recoveryCode(req, res) {
	if (!req.body.email || !req.body.code) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}
		const keys = getResetKeys();
		if (!keys[user.id]) {
			res.status(400).send({ message: "No recovery code sent" });
			return;
		}
		if (keys[user.id].key !== req.body.code) {
			res.status(400).send({ message: "Invalid code" });
			return;
		}
		res.status(200).send({ message: "Code is valid" });
		setResetKey(user.id, { email: req.body.email, key: req.body.code, wasUsed: true });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Internal server error" });
	}
}
