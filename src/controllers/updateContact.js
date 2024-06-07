import {
	updateContact as DBUpdate,
	getContactPhone,
	getContactEmail,
	getContactURL,
	getContactDate,
	insertContactDate,
	insertContactEmail,
	insertContactPhone,
	insertContactURL,
	deleteContactDate,
	deleteContactEmail,
	deleteContactPhone,
	deleteContactURL,
	updateContactEmail,
	updateContactPhone,
	updateContactURL,
	updateContactDate,
} from "../utils/DBComponent.js";

/**
 * Update a contact
 * @param {Number} req.body.contactId - Required
 * @param {String} req.body.firstName - Optional
 * @param {String} req.body.lastName - Optional
 * @param {String} req.body.alias - Optional
 * @param {String} req.body.company - Optional
 * @param {String} req.body.address - Optional
 * @param {String} req.body.color - Optional
 */
export async function updateContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.contactId) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const result = await DBUpdate(
		req.session.userId,
		req.body.contactId,
		req.body.firstName,
		req.body.lastName,
		req.body.alias,
		req.body.company,
		req.body.address,
		req.body.color
	);

	if (req.body.phones) {
		const phones = await getContactPhone(req.session.userId, req.body.contactId);
		if (phones.length > req.body.phones.length) {
			for (let i = req.body.phones.length; i < phones.length; i++) {
				await deleteContactPhone(req.session.userId, req.body.contactId, phones[i].id);
			}
		} else if (phones.length < req.body.phones.length) {
			for (let i = phones.length; i < req.body.phones.length; i++) {
				await insertContactPhone(req.session.userId, req.body.contactId, 1, 58, 0);
			}
		}
		for (let i = 0; i < req.body.phones.length; i++) {
			await updateContactPhone(
				i + 1,
				req.session.userId,
				req.body.contactId,
				req.body.phones[i].phoneType,
				req.body.phones[i].phoneCode,
				req.body.phones[i].phoneNumber
			);
		}
	}
	if (req.body.emails) {
		const emails = await getContactEmail(req.session.userId, req.body.contactId);
		if (emails.length > req.body.emails.length) {
			for (let i = req.body.emails.length; i < emails.length; i++) {
				await deleteContactEmail(req.session.userId, req.body.contactId, emails[i].id);
			}
		} else if (emails.length < req.body.emails.length) {
			for (let i = emails.length; i < req.body.emails.length; i++) {
				await insertContactEmail(req.session.userId, req.body.contactId, 0, "example@example.com");
			}
		}
		for (let i = 0; i < req.body.emails.length; i++) {
			await updateContactEmail(i + 1, req.session.userId, req.body.contactId, req.body.emails[i].emailType, req.body.emails[i].emailDirection);
		}
	}
	if (req.body.urls) {
		const urls = await getContactURL(req.session.userId, req.body.contactId);
		if (urls.length > req.body.urls.length) {
			for (let i = req.body.urls.length; i < urls.length; i++) {
				await deleteContactURL(req.session.userId, req.body.contactId, urls[i].id);
			}
		} else if (urls.length < req.body.urls.length) {
			for (let i = urls.length; i < req.body.urls.length; i++) {
				await insertContactURL(req.session.userId, req.body.contactId, "", 0);
			}
		}
		for (let i = 0; i < req.body.urls.length; i++) {
			await updateContactURL(i + 1, req.session.userId, req.body.contactId, req.body.urls[i].url, req.body.urls[i].type);
		}
	}
	if (req.body.dates) {
		const dates = await getContactDate(req.session.userId, req.body.contactId);
		if (dates.length > req.body.dates.length) {
			for (let i = req.body.dates.length; i < dates.length; i++) {
				await deleteContactDate(req.session.userId, req.body.contactId, dates[i].id);
			}
		} else if (dates.length < req.body.dates.length) {
			for (let i = dates.length; i < req.body.dates.length; i++) {
				await insertContactDate(req.session.userId, req.body.contactId, 0, "2000-01-01");
			}
		}
		for (let i = 0; i < req.body.dates.length; i++) {
			await updateContactDate(i + 1, req.session.userId, req.body.contactId, req.body.dates[i].dateType, req.body.dates[i].contactDate);
		}
	}

	if (result) {
		res.send({ message: "Contact updated" });
	} else {
		res.status(400).send({ message: "Error updating contact" });
		console.log(result);
	}
}
