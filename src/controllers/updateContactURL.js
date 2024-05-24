import { updateContactURL as updateContactURLDB } from "../utils/DBComponent.js";

export async function updateContactURL(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.url || !req.body.urlId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const result = await updateContactURLDB(req.body.urlId, req.session.userId, req.body.contactId, req.body.url);
	if (result) {
		res.send({ message: "URL updated" });
	} else {
		res.status(400).send({ message: "Error updating URL" });
	}
}
