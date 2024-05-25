import { getContacts as getContactsDB } from "../utils/DBComponent.js";

export async function getContacts(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	try {
		const result = await getContactsDB(req.session.userId);
		if (!result) {
			res.status(500).send({ message: "Error getting contacts" });
			return;
		}
		res.status(200).json({ message: "Contacts found", contacts: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
