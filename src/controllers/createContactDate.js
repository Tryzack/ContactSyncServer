import { insertContactDate } from "../utils/DBComponent.js";

export async function createContactDate(req, res) {
	if (!req.session.userId) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	const { contactId, dateType, date } = req.body;
	if (!contactId || !date) {
		return res.status(400).send({ message: "Missing data" });
	}
	// date format: yyyy-mm-dd
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(date)) {
		return res.status(400).send({ message: "Invalid date format" });
	}
	const result = await insertContactDate(req.session.userId, contactId, dateType, date);
	if (!result) {
		return res.status(500).send({ message: "Error creating date" });
	}
	return res.status(201).send({ message: "Date created" });
}
