import { deleteContact as deleteContactDB } from "../utils/DBComponent";

export async function deleteContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		await deleteContactDB(req.session.userId, req.body.contactId);
		res.send({ message: "Contact deleted" });
	} catch (error) {
		res.status(500).send({ message: "Error deleting contact" });
	}
}
