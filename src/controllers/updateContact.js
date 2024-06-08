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
	findContactPhoneByCodeAndNumber,
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
	if (req.body.phones) {
		for (let i = 0; i < req.body.phones.length; i++) {
			const phone = req.body.phones[i];
			try {
				const phoneExists = await findContactPhoneByCodeAndNumber(req.session.userId, phone.phoneCode, phone.phoneNumber, req.body.contactId);
				if (phoneExists) {
					res.status(450).send({ message: "Phone number already exists" });
					return;
				}
			} catch (error) {
				console.error(`Error finding phone for user: ${req.session.userId} \n error: ${error}`);
				return;
			}
		}
	}

	try {
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
					try {
						await deleteContactEmail(req.session.userId, req.body.contactId, emails[i].id);
					} catch (error) {
						console.error(`Error deleting email for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			} else if (emails.length < req.body.emails.length) {
				for (let i = emails.length; i < req.body.emails.length; i++) {
					try {
						await insertContactEmail(req.session.userId, req.body.contactId, 0, "example@example.com");
					} catch (error) {
						console.error(`Error inserting email for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			}
			for (let i = 0; i < req.body.emails.length; i++) {
				try {
					await updateContactEmail(i + 1, req.session.userId, req.body.contactId, req.body.emails[i].type, req.body.emails[i].email);
				} catch (error) {
					console.error(`Error updating email for user: ${req.session.userId} \n error: ${error}`);
				}
			}
		}
		if (req.body.urls) {
			const urls = await getContactURL(req.session.userId, req.body.contactId);
			if (urls.length > req.body.urls.length) {
				for (let i = req.body.urls.length; i < urls.length; i++) {
					try {
						await deleteContactURL(req.session.userId, req.body.contactId, urls[i].id);
					} catch (error) {
						console.error(`Error deleting url for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			} else if (urls.length < req.body.urls.length) {
				for (let i = urls.length; i < req.body.urls.length; i++) {
					try {
						await insertContactURL(req.session.userId, req.body.contactId, "", 0);
					} catch (error) {
						console.error(`Error inserting url for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			}
			for (let i = 0; i < req.body.urls.length; i++) {
				try {
					await updateContactURL(i + 1, req.session.userId, req.body.contactId, req.body.urls[i].url, req.body.urls[i].type);
				} catch (error) {
					console.error(`Error updating url for user: ${req.session.userId} \n error: ${error}`);
				}
			}
		}
		if (req.body.dates) {
			const dates = await getContactDate(req.session.userId, req.body.contactId);
			if (dates.length > req.body.dates.length) {
				for (let i = req.body.dates.length; i < dates.length; i++) {
					try {
						await deleteContactDate(req.session.userId, req.body.contactId, dates[i].id);
					} catch (error) {
						console.error(`Error deleting date for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			} else if (dates.length < req.body.dates.length) {
				for (let i = dates.length; i < req.body.dates.length; i++) {
					try {
						await insertContactDate(req.session.userId, req.body.contactId, 0, "2000-01-01");
					} catch (error) {
						console.error(`Error inserting date for user: ${req.session.userId} \n error: ${error}`);
					}
				}
			}
			for (let i = 0; i < req.body.dates.length; i++) {
				try {
					await updateContactDate(i + 1, req.session.userId, req.body.contactId, req.body.dates[i].type, req.body.dates[i].date);
				} catch (error) {
					console.error(`Error updating date for user: ${req.session.userId} \n error: ${error}`);
				}
			}
		}

		if (result) {
			res.send({ message: "Contact updated" });
		} else {
			res.status(400).send({ message: "Error updating contact" });
			console.log(result);
		}
	} catch (error) {
		res.status(400).send({ message: "Error updating contact" });
		console.error(error);
	}
}
