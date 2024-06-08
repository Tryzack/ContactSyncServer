import { insertContactPhone } from "../utils/DBComponent.js";

/**
 * Create a new phone
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.phoneType - Optional Default 1
 * @param {Number} req.body.phoneCode - Optional Default 58
 * @param {Number} req.body.phoneNumber - Required
 */
export async function createPhone(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.phoneNumber) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	try {
		let result = await insertContactPhone(
			req.session.userId,
			req.body.contactId,
			req.body.phoneType ? req.body.phoneType : 1,
			req.body.phoneCode ? req.body.phoneCode : 58,
			req.body.phoneNumber
		);
		if (result) {
			res.send({ message: "Phone created" });
		} else {
			res.status(500).send({ message: "Error creating phone" });
		}
	} catch (error) {
		res.status(500).send({ message: "Error creating phone" });
	}
}
