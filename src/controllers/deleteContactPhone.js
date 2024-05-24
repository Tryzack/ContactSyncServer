import { deleteContactPhone as deleteContactPhoneDB } from "../utils/DBComponent";

export async function deleteContactPhone(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.phoneId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await deleteContactPhoneDB(req.session.userId, req.body.contactId, req.body.phoneId);

	if (result) {
		res.send({ message: "Phone deleted" });
	} else {
		res.status(400).send({ message: "Error deleting phone" });
	}
}
