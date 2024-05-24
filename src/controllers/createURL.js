import { insertContactURL } from "../utils/DBComponent.js";

export async function createURL(req, res) {
	if (!req.session.userId) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	if (!req.bodycontactId || !req.bodyurl) {
		return res.status(400).send({ message: "Missing data" });
	}
	const result = await insertContactURL(req.session.userId, req.bodycontactId, req.bodyurl);
	if (!result) {
		return res.status(500).send({ message: "Error creating URL" });
	}
	return res.status(201).send({ message: "URL created" });
}
