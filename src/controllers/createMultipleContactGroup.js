import { insertContactGroup, getContactGroup } from "../utils/DBComponent.js";

export async function createMultipleContactGroup(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactIds || !req.body.groupId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const contactIds = req.body.contactIds;
	const groupId = req.body.groupId;
	let contactsAlreadyInGroup = [];

	for (const contactId of contactIds) {
		const contactGroup = await getContactGroup(req.session.userId, contactId, groupId);
		if (contactGroup && contactGroup.length > 0) {
			contactsAlreadyInGroup.push(contactId);
		}
	}

	for (const contactId of contactIds) {
		if (contactsAlreadyInGroup.includes(contactId)) {
			continue;
		}
		const result = await insertContactGroup(req.session.userId, contactId, groupId);

		if (!result) {
			res.status(400).send({ message: "Error adding contacts to group" });
			return;
		}
	}
	if (contactIds.length === contactsAlreadyInGroup.length) {
		res.send({ message: "Contacts already in group" });
		return;
	} else if (contactsAlreadyInGroup.length > 0) {
		res.send({ message: "Contacts added to group, some contacts were alredy in group" });
		return;
	}
	res.send({ message: "Contacts added to group" });
}
