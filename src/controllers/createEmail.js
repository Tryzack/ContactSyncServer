import { insertContactEmail } from "../utils/DBComponent.js";

/**
 * Create a new email
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.emailType - Optional
 * @param {String} req.body.emailDirection - Required
 */
export async function createEmail(req, res) {
	if (!req.session.userId) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	const { contactId, emailType, emailDirection } = req.body;
	if (!contactId || !emailDirection) {
		return res.status(400).send({ message: "Missing data" });
	}
	try {
		const result = await insertContactEmail(req.session.userId, contactId, emailType ? emailType : 1, emailDirection);
		if (!result) {
			return res.status(500).send({ message: "Error creating email" });
		}
		return res.status(201).send({ message: "Email created" });
	} catch (error) {
		return res.status(500).send({ message: "Error creating email" });
	}
}
