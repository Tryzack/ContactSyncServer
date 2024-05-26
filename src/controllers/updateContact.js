import { updateContact as DBUpdate } from "../utils/DBComponent.js";

/**
 * Update a contact
 * @param {Number} req.body.contactId - Required
 * @param {String} req.body.firstName - Optional
 * @param {String} req.body.lastName - Optional
 * @param {String} req.body.alias - Optional
 * @param {String} req.body.company - Optional
 * @param {String} req.body.address - Optional
 * @param {String} req.body.color - Optional
 */
export async function updateContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await DBUpdate(
		req.session.userId,
		req.body.contactId,
		req.body.firstName,
		req.body.lastName,
		req.body.alias,
		req.body.company,
		req.body.address,
		req.body.color
	);

	if (result) {
		res.send({ message: "Contact updated" });
	} else {
		res.status(400).send({ message: "Error updating contact" });
		console.log(result);
	}
}
