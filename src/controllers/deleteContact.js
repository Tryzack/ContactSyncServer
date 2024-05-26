import { deleteContact as deleteContactDB } from "../utils/DBComponent.js";

/**
 * Delete a contact
 * @param {Number} req.body.contactId - Required
 */
export async function deleteContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	if (req.body.contactId === 1) {
		res.status(400).send({ message: "Cannot delete main contact" });
		return;
	}
	try {
		let result = await deleteContactDB(req.session.userId, req.body.contactId);
		if (!result) {
			res.status(500).send({ message: "Error deleting contact" });
			return;
		}
		res.send({ message: "Contact deleted" });
	} catch (error) {
		res.status(500).send({ message: "Error deleting contact" });
	}
}
