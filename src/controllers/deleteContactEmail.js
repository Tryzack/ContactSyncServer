import { deleteContactEmail as deleteContactEmailDB } from "../utils/DBComponent";

export async function deleteContactEmail(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.emailId || !req.session.contactId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactEmailDB(req.session.userId, req.session.contactId, req.body.emailId);
		if (result === false) {
			res.status(400).send({ message: "Email not found" });
			return;
		}
		res.send({ message: "Email deleted" });
	} catch (error) {
		res.status(500).send({ message: "Error deleting email" });
	}
}
