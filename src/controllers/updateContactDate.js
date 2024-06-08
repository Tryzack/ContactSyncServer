import { updateContactDate as updateContactDateDB } from "../utils/DBComponent.js";

/**
 * Update a date from a contact
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.dateType - Optional
 * @param {String} req.body.date - Required
 * @param {Number} req.body.id - Required
 */
export async function updateContactDate(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.date || !req.body.id) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(req.body.date)) {
		res.status(400).send({ message: "Invalid date format" });
		return;
	}
	try {
		const result = await updateContactDateDB(req.body.id, req.session.userId, req.body.contactId, req.body.dateType || 1, req.body.date);
		if (result) {
			res.send({ message: "Date updated" });
		} else {
			res.status(400).send({ message: "Error updating date" });
		}
	} catch (error) {
		res.status(400).send({ message: "Error updating date" });
	}
}
