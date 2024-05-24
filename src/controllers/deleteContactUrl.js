import { deleteContactURL as deleteContactURLDB } from "../utils/DBComponent";

export const deleteContactUrl = async (req, res) => {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.urlId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactURLDB(req.session.userId, req.body.contactId, req.body.urlId);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
