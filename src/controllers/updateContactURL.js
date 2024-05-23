import { updateContactURL } from "../utils/DBComponent";

export async function updateContactURLController(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.url) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const result = await updateContactURL(req.session.userId, req.body.contactId, req.body.url);
	if (result) {
		res.send({ message: "URL updated" });
	} else {
		res.status(400).send({ message: "Error updating URL" });
	}
}
