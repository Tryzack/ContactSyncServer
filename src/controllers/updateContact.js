import { updateContact as DBUpdate } from "../utils/DBComponent.js";

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
		req.body.address
	);

	if (result) {
		res.send({ message: "Contact updated" });
	} else {
		res.status(400).send({ message: "Error updating contact" });
	}
}
