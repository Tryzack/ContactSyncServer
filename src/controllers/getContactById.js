import { getContactById as getContactByIdDB } from "../utils/DBComponent.js";

export async function getContactById(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const contactId = req.query.id;
	try {
		const result = await getContactByIdDB(req.session.userId, contactId);
		if (!result) {
			res.status(500).send({ message: "Error getting contact" });
			return;
		}
		res.status(200).json({ message: "Contact found", contact: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
