import { insertGroup } from "../utils/DBComponent";

export async function createGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.name) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await insertGroup(req.session.userId, req.body.name, req.body.description);

	if (result) {
		res.send({ message: "Group created" });
	} else {
		res.status(400).send({ message: "Error creating group" });
	}
}
