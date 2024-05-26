import { insertContact, insertContactPhone, insertContactDate, insertContactEmail, insertContactURL } from "../utils/DBComponent.js";

/**
 * Create a new contact
 * @param {String} req.body.firstName - Required
 * @param {String} req.body.lastName - Optional
 * @param {String} req.body.alias - Optional
 * @param {String} req.body.company - Optional
 * @param {String} req.body.address - Optional
 * @param {Number} req.body.color - Optional
 * @param {Array} req.body.phones - Optional
 * @param {Array} req.body.emails - Optional
 * @param {Array} req.body.dates - Optional
 * @param {Array} req.body.urls - Optional
 * @returns
 */
export async function createContact(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.firstName) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	let result;
	try {
		result = await insertContact(
			req.session.userId,
			req.body.firstName,
			req.body.lastName,
			req.body.alias,
			req.body.company,
			req.body.address,
			req.body.color
		);
	} catch (error) {
		res.status(400).send({ message: "Error creating contact" });
		return;
	}
	if (req.body.phones && req.body.phones.length > 0) {
		req.body.phones.forEach((phone) => {
			try {
				insertContactPhone(result, 1, phone.type, phone.code, phone.number);
			} catch (error) {
				console.error(`Error creating phone for user: ${req.session.userId} \n error: ${error}`);
				return;
			}
		});
	}
	if (req.body.emails && req.body.emails.length > 0) {
		req.body.emails.forEach((email) => {
			try {
				insertContactEmail(result, 1, email.type, email.email);
			} catch (error) {
				console.error(`Error creating email for user: ${req.session.userId} \n error: ${error}`);
				return;
			}
		});
	}
	if (req.body.dates && req.body.dates.length > 0) {
		req.body.dates.forEach((date) => {
			try {
				insertContactDate(result, 1, date.type, date.date);
			} catch (error) {
				console.error(`Error creating date for user: ${req.session.userId} \n error: ${error}`);
				return;
			}
		});
	}
	if (req.body.urls && req.body.urls.length > 0) {
		req.body.urls.forEach((url) => {
			try {
				insertContactURL(result, 1, url.type, url.url);
			} catch (error) {
				console.error(`Error creating url for user: ${req.session.userId} \n error: ${error}`);
				return;
			}
		});
	}
	if (result) {
		res.send({ message: "Contact created" });
	} else {
		res.status(400).send({ message: "Error creating contact" });
	}
}
