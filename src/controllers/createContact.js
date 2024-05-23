import { insertContact } from "../utils/DBComponent.js";

export async function createContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.firstName) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await insertContact(req.session.userId, req.body.firstName, req.body.lastName, req.body.alias, req.body.company, req.body.address);

	if (result) {
		res.send({ message: "Contact created" });
	} else {
		res.status(400).send({ message: "Error creating contact" });
	}
}
