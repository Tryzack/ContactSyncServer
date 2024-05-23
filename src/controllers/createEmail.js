import { insertContactEmail } from "../utils/DBComponent";

export default async function createEmail(req, res) {
	const { userId, contactId, emailType, emailDirection } = req.body;
	if (!userId || !contactId || !emailDirection) {
		return res.status(400).send({ message: "Missing data" });
	}
	const result = await insertContactEmail(userId, contactId, emailType ? emailType : 1, emailDirection);
	if (!result) {
		return res.status(500).send({ message: "Error creating email" });
	}
	return res.status(201).send({ message: "Email created" });
}
