import { getContactEmail as getContactEmailDB } from "../utils/DBComponent.js";

/**
 * Get a contact email
 * @param {Number} req.query.id - Required
 * @returns {Object} - Contact email
 */
export async function getContactEmail(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const contactId = req.query.id;
	try {
		const result = await getContactEmailDB(req.session.userId, contactId);
		if (!result) {
			res.status(500).send({ message: "Error getting contact email" });
			return;
		}
		res.status(200).json({ message: "Contact email found", contactEmail: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
