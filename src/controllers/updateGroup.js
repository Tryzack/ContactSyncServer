import { updateGroup as updateGroupDB } from "../utils/DBComponent.js";

/**
 * Update a group
 * @param {String} req.body.groupName - Required
 * @param {String} req.body.groupDescription - Optional
 * @param {Number} req.body.id - Required
 */
export async function updateGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.groupName || !req.body.id) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	if (req.body.id <= 2) {
		res.status(400).send({ message: "Favorite and Emergency groups cannot be modified" });
		return;
	}
	try {
		const result = await updateGroupDB(
			req.session.userId,
			req.body.id,
			req.body.groupName,
			req.body.groupDescription || "",
			req.body.color || ""
		);
		if (result) {
			res.send({ message: "Group updated" });
		} else {
			res.status(400).send({ message: "Error updating group" });
		}
	} catch (error) {
		res.status(400).send({ message: "Error updating group" });
	}
}
