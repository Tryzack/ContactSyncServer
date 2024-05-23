import { insertContactGroup } from "../utils/DBComponent.js";

export async function createContactGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await insertContactGroup(req.session.userId, req.body.contactId, req.body.groupId);

	if (result) {
		res.send({ message: "Contact added to group" });
	} else {
		res.status(400).send({ message: "Error adding contact to group" });
	}
}
