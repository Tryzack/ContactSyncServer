import { deleteContactFromGroup as deleteContactFromGroupDB } from "../utils/DBComponent.js";

/**
 * Delete a contact from a group
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.groupId - Required
 */
export const deleteContactFromGroup = async (req, res) => {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactFromGroupDB(req.session.userId, req.body.contactId, req.body.groupId);
		if (!result) {
			res.status(500).send({ message: "Error deleting contact from group" });
			return;
		}
		res.status(200).json({ message: "Contact removed from group" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
