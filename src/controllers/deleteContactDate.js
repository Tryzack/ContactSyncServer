import { deleteContactDate as deleteContactDateDB } from "../utils/DBComponent.js";

/**
 * Delete a date from a contact
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.dateId - Required
 */
export const deleteContactDate = async (req, res) => {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.dateId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	try {
		const result = await deleteContactDateDB(req.session.userId, req.body.contactId, req.body.dateId);
		if (!result) {
			res.status(500).send({ message: "Error deleting date" });
			return;
		}
		res.status(200).json({ message: "Date removed from contact" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
