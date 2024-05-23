import { insertContactDate } from "../utils/DBComponent";

export default async function createContactDate(req, res) {
	const { userId, contactId, date } = req.body;
	if (!userId || !contactId || !date) {
		return res.status(400).send({ message: "Missing data" });
	}
	// date format: yyyy-mm-dd
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(date)) {
		return res.status(400).send({ message: "Invalid date format" });
	}
	const result = await insertContactDate(userId, contactId, date);
	if (!result) {
		return res.status(500).send({ message: "Error creating date" });
	}
	return res.status(201).send({ message: "Date created" });
}
