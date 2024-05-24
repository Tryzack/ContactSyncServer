import { insertContactURL } from "../utils/DBComponent.js";

export async function createURL(req, res) {
	if (!req.session.userId) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	if (!req.body.contactId || !req.body.url) {
		return res.status(400).send({ message: "Missing data" });
	}
	const result = await insertContactURL(req.session.userId, req.body.contactId, req.body.url);
	if (!result) {
		return res.status(500).send({ message: "Error creating URL" });
	}
	return res.status(201).send({ message: "URL created" });
}
