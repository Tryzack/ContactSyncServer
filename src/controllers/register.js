import bcrypt from "bcrypt";
import {
	insertUser,
	insertGroup,
	insertContact,
	insertContactPhone,
	insertContactDate,
	insertContactEmail,
	insertContactURL,
	getUserByEmail,
} from "../utils/DBComponent.js";

/**
 * Register a new user
 * @param {String} req.body.email - Required
 * @param {String} req.body.password - Required
 * @param {String} req.body.firstName - Required
 * @param {String} req.body.lastName - Optional
 * @param {String} req.body.alias - Optional
 * @param {String} req.body.company - Optional
 * @param {String} req.body.address - Optional
 * @param {String} req.body.color - Optional
 * @param {Array} req.body.phones - Optional
 * @param {Array} req.body.emails - Optional
 * @param {Array} req.body.dates - Optional
 * @param {Array} req.body.urls - Optional
 */
export async function register(req, res) {
	if (!req.body.email || !req.body.password) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	if (req.body.password.length < 8) {
		res.status(401).send({ message: "Password must be at least 8 characters" });
		return;
	}

	try {
		const existingUser = await getUserByEmail(req.body.email);
		if (existingUser) {
			res.status(409).send({ message: "User already exists" });
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		let user_id = await insertUser(req.body.email, password);
		if (user_id === false) {
			res.status(500).send({ message: "There was an error" });
			return;
		}
		insertGroup(user_id, "Favorites", "List of favorite contacts", (color = 1));
		insertGroup(user_id, "Emergency", "List of emergency contacts", (color = 2));
		insertContact(user_id, req.body.firstName, req.body.lastName, req.body.alias, req.body.company, req.body.address, req.body.color);
		if (req.body.phones && req.body.phones.length > 0) {
			req.body.phones.forEach((phone) => {
				insertContactPhone(user_id, 1, phone.type, phone.code, phone.number);
			});
		}
		if (req.body.emails && req.body.emails.length > 0) {
			req.body.emails.forEach((email) => {
				const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
				if (!regex.test(email.direction)) {
					res.status(400).send({ message: "Invalid email format" });
					return;
				}
				insertContactEmail(user_id, 1, email.type, email.direction);
			});
		}
		if (req.body.dates && req.body.dates.length > 0) {
			req.body.dates.forEach((date) => {
				const regex = /^\d{4}-\d{2}-\d{2}$/;
				if (!regex.test(date.date)) {
					res.status(400).send({ message: "Invalid date format" });
					return;
				}
				insertContactDate(user_id, 1, date.type, date.date);
			});
		}
		if (req.body.urls && req.body.urls.length > 0) {
			req.body.urls.forEach((url) => {
				insertContactURL(user_id, 1, url.url);
			});
		}
		res.send({ message: "Registered" });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Internal server error" });
	}
}
