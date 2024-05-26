import { getContactPhone as getContactPhoneDB } from "../utils/DBComponent.js";

/**
 * Get a phone from a contact
 * @param {Number} req.query.id - Required
 * @returns {Object} - Contact phone
 */
export async function getContactPhone(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const contactId = req.query.id;
	try {
		const result = await getContactPhoneDB(req.session.userId, contactId);
		if (!result) {
			res.status(500).send({ message: "Error getting contact phone" });
			return;
		}
		res.status(200).json({ message: "Contact phone found", contactPhone: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
