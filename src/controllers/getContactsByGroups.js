import { getContactByGroups as getContactByGroupsDB } from "../utils/DBComponent.js";

/**
 * Get contacts by groups
 * @param {Number} req.query.id - Required
 * @returns {Object} - Contacts
 */
export async function getContactsByGroups(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const groupId = req.query.id;
	try {
		const result = await getContactByGroupsDB(req.session.userId, groupId);
		if (!result) {
			res.status(500).send({ message: "Error getting contacts by groups" });
			return;
		}
		res.status(200).json({ message: "Contacts found", contacts: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
