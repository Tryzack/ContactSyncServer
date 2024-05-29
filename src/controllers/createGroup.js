import { insertGroup } from "../utils/DBComponent.js";

/**
 * Create a new group
 * @param {String} req.body.name - Required
 * @param {String} req.body.description - Optional
 * @param {String} req.body.color - Optional
 */
export async function createGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.name) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await insertGroup(req.session.userId, req.body.name, req.body.description, req.body.color);

	if (result.response) {
		res.send({ message: "Group created", group_id: result.id });
	} else {
		res.status(400).send({ message: "Error creating group" });
	}
}
