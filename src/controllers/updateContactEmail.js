import { updateContactEmail as updateContactEmailDB } from "../utils/DBComponent.js";

/**
 * Update a contact email
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.emailDirection - Required
 * @param {Number} req.body.id - Required
 * @param {Number} req.body.emailType - Optional
 */
export async function updateContactEmail(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.emailDirection || !req.body.id) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await updateContactEmailDB(req.body.id, req.session.userId, req.body.contactId, req.body.emailType || 1, req.body.emailDirection);

	if (result) {
		res.send({ message: "Email updated" });
	} else {
		res.status(400).send({ message: "Error updating email" });
	}
}
