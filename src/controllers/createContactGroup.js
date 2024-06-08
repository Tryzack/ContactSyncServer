import { insertContactGroup, getContactGroup } from "../utils/DBComponent.js";

/**
 * Create a new contact group
 * @param {Number} req.body.contactId - Required
 * @param {Number} req.body.groupId - Required
 */

export async function createContactGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId || !req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	try {
		const contactGroup = await getContactGroup(req.session.userId, req.body.contactId, req.body.groupId);
		if (contactGroup && contactGroup.length > 0) {
			res.status(400).send({ message: "Contact is already in group" });
			return;
		}
	} catch (error) {
		res.status(400).send({ message: "Error adding contact to group" });
		return;
	}

	try {
		const result = await insertContactGroup(req.session.userId, req.body.contactId, req.body.groupId);

		if (result) {
			res.send({ message: "Contact added to group" });
		} else {
			res.status(400).send({ message: "Error adding contact to group" });
		}
	} catch (error) {
		res.status(400).send({ message: "Error adding contact to group" });
	}
}
