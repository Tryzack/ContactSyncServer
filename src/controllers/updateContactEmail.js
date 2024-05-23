import { updateContactEmail } from "../utils/DBComponent";

export async function updateContactEmail(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.emailDirection) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await updateContactEmail(req.session.userId, req.body.contactId, req.body.emailType || 1, req.body.emailDirection);

	if (result) {
		res.send({ message: "Email updated" });
	} else {
		res.status(400).send({ message: "Error updating email" });
	}
}
