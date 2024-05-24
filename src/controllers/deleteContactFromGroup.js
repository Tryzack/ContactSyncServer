import { deleteContactFromGroup as deleteContactFromGroupDB } from "../utils/DBComponent";

export const deleteContactFromGroup = async (req, res) => {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteContactFromGroupDB(req.session.userId, req.body.contactId, req.body.groupId);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
