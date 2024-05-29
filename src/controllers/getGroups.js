import { getGroups as getGroupsDB, getAllContactsAndGroups } from "../utils/DBComponent.js";

/**
 * Get all groups
 * @returns {Object} - Groups
 */
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
		const contactGroups = await getAllContactsAndGroups(req.session.userId);
		const transformedResult = [];
		contactGroups.contacts.forEach((contact) => {
			const groupId = contact.group_id;
			const contactId = contact.contact_id;
			const groupIndex = transformedResult.findIndex((group) => group.group_id === groupId);
			if (groupIndex === -1) {
				transformedResult.push({ group_id: groupId, contacts: [contactId] });
			} else {
				transformedResult[groupIndex].contacts.push(contactId);
			}
		});
		result.forEach((group) => {
			// find the group in transformedResult and add the property contacts in the group from transformedResult[foundIndex].contacts
			const foundIndex = transformedResult.findIndex((transformedGroup) => transformedGroup.group_id === group.id);
			if (foundIndex !== -1) {
				if (transformedResult[foundIndex].contacts) group.contactCount = transformedResult[foundIndex].contacts.length;
			} else {
				group.contactCount = 0;
			}
		});
		res.status(200).json({ message: "Groups found", groups: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.error(error);
	}
}
