import { getContactDate as getContactDateDB } from "../utils/DBComponent.js";

export async function getContactDate(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	const contactId = req.query.id;
	try {
		const result = await getContactDateDB(req.session.userId, contactId);
		if (!result) {
			res.status(500).send({ message: "Error getting contact date" });
			return;
		}

		result[0].contact_date = result[0].contact_date.toISOString().split("T")[0];

		res.status(200).json({ message: "Contact date found", contactDate: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
