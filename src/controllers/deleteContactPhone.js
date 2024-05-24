import { deleteContactPhone as deleteContactPhoneDB } from "../utils/DBComponent.js";

export async function deleteContactPhone(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.phoneId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactPhoneDB(req.session.userId, req.body.contactId, req.body.phoneId);
		if (!result) {
			res.status(400).send({ message: "Error deleting phone" });
			return;
		}
		res.send({ message: "Phone deleted" });
	} catch (error) {
		res.status(500).send({ message: "Error deleting phone" });
	}
}
