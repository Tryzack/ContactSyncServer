import { getContactById as getContactByIdDB, getContactPhone, getContactEmail, getContactURL, getContactDate } from "../utils/DBComponent.js";

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
		const phones = await getContactPhone(req.session.userId, contactId);
		if (!phones) {
			res.status(500).send({ message: "Error getting contact phones" });
			return;
		}
		const emails = await getContactEmail(req.session.userId, contactId);
		if (!emails) {
			res.status(500).send({ message: "Error getting contact emails" });
			return;
		}
		const urls = await getContactURL(req.session.userId, contactId);
		if (!urls) {
			res.status(500).send({ message: "Error getting contact urls" });
			return;
		}
		const dates = await getContactDate(req.session.userId, contactId);
		if (!dates) {
			res.status(500).send({ message: "Error getting contact dates" });
			return;
		}

		res.status(200).json({ message: "Contact found", contact: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
