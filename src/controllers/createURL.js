import { insertContactURL } from "../utils/DBComponent";

export default async function createURL(req, res) {
	const { userId, contactId, url } = req.body;
	if (!userId || !contactId || !url) {
		return res.status(400).send({ message: "Missing data" });
	}
	const result = await insertContactURL(userId, contactId, url);
	if (!result) {
		return res.status(500).send({ message: "Error creating URL" });
	}
	return res.status(201).send({ message: "URL created" });
}
