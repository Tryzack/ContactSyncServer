import { deleteContactURL as deleteContactURLDB } from "../utils/DBComponent.js";

/**
 * Delete a URL from a contact
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.urlId - Required
 */
export const deleteContactUrl = async (req, res) => {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.urlId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactURLDB(req.session.userId, req.body.contactId, req.body.urlId);
		if (!result) {
			res.status(500).send({ message: "Error deleting URL" });
			return;
		}
		res.status(200).json({ message: "URL deleted" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
