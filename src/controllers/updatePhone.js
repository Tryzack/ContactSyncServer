import { updateContactPhone as updateContactPhoneDB } from "../utils/DBComponent.js";

/**
 * Update a phone from a contact
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.phoneNumber - Required
 * @param {Number} req.body.id - Required
 * @param {Number} req.body.phoneType - Optional
 * @param {Number} req.body.phoneCode - Optional
 */
export async function updateContactPhone(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.phoneNumber || !req.body.id) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await updateContactPhoneDB(
		req.body.id,
		req.session.userId,
		req.body.contactId,
		req.body.phoneType || 1,
		req.body.phoneCode || 58,
		req.body.phoneNumber
	);

	if (result) {
		res.send({ message: "Phone updated" });
	} else {
		res.status(400).send({ message: "Error updating phone" });
	}
}
