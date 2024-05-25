import { getAllContactsAndGroups as getAllContactsAndGroupsDB } from "../utils/DBComponent.js";

export async function getAllContactsAndGroups(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	try {
		const result = await getAllContactsAndGroupsDB(req.session.userId);
		if (!result) {
			res.status(500).send({ message: "Error getting contacts and groups" });
			return;
		}
		// Transforming the result to include group_id as a separate field
		const transformedResult = [];
		result.contacts.forEach((contact) => {
			const groupId = contact.group_id;
			const contactId = contact.contact_id;
			const groupIndex = transformedResult.findIndex((group) => group.group_id === groupId);
			if (groupIndex === -1) {
				transformedResult.push({ group_id: groupId, contacts: [contactId] });
			} else {
				transformedResult[groupIndex].contacts.push(contactId);
			}
		});

		res.status(200).json({ message: "Contacts and groups found", contacts: transformedResult });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
