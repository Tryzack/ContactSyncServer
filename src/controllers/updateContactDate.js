import { updateContactDate } from "../utils/DBComponent";

export async function updateContactDateController(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.date) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(req.body.date)) {
		res.status(400).send({ message: "Invalid date format" });
		return;
	}
	const result = await updateContactDate(req.session.userId, req.body.contactId, req.body.date);
	if (result) {
		res.send({ message: "Date updated" });
	} else {
		res.status(400).send({ message: "Error updating date" });
	}
}
