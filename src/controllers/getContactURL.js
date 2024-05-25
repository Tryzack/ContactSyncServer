import { getContactURL as getContactURLDB } from "../utils/DBComponent.js";

export async function getContactURL(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const contactId = req.query.id;
	try {
		const result = await getContactURLDB(req.session.userId, contactId);
		if (!result) {
			res.status(500).send({ message: "Error getting contact URL" });
			return;
		}
		res.status(200).json({ message: "Contact URL found", contactURL: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
