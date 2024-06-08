import { insertContactURL } from "../utils/DBComponent.js";

/**
 * Create a new URL
 * @param {Number} req.body.contactId - Required
 * @param {String} req.body.url - Required
 * @param {Number} req.body.type - Optional
 */
export async function createURL(req, res) {
	if (!req.session.userId) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	if (!req.body.contactId || !req.body.url) {
		return res.status(400).send({ message: "Missing data" });
	}
	try {
		const result = await insertContactURL(req.session.userId, req.body.contactId, req.body.url, req.body.type || 1);
		if (!result) {
			return res.status(500).send({ message: "Error creating URL" });
		}
		return res.status(201).send({ message: "URL created" });
	} catch (error) {
		return res.status(500).send({ message: "Error creating URL" });
	}
}
