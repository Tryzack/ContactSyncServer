import { getGroups as getGroupsDB } from "../utils/DBComponent.js";

export async function getGroups(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	try {
		const result = await getGroupsDB(req.session.userId);
		if (!result) {
			res.status(500).send({ message: "Error getting groups" });
			return;
		}
		res.status(200).json({ message: "Groups found", groups: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
