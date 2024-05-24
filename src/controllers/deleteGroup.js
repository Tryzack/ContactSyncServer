import { deleteGroup as deleteGroupDB } from "../utils/DBComponent";

export async function deleteGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const result = await deleteGroupDB(req.session.userId, req.body.groupId);
		if (result === false) {
			res.status(400).send({ message: "Group not found" });
			return;
		}
		res.send({ message: "Group deleted" });
	} catch (error) {
		res.status(500).send({ message: "Error deleting group" });
	}
}
