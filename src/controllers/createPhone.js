import { insertContactPhone } from "../utils/DBComponent";

export async function createPhone(req, res) {
	if (!req.body.userId || !req.body.contactId || !req.body.phoneNumber) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	let result = await insertContactPhone(
		req.body.userId,
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
}
