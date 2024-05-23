import bcrypt from "bcrypt";
import {
	insertUser,
	insertGroup,
	insertContact,
	insertContactPhone,
	insertContactDate,
	insertContactEmail,
	insertContactURL,
} from "../utils/DBComponent.js";

export async function register(req, res) {
	if (!req.body.email || !req.body.password || !req.body.firstName) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		let user_id = await insertUser(req.body.email, password);
		if (user_id === false) {
			res.status(400).send({ message: "User already exists" });
			return;
		}
		insertGroup(user_id, "Favorites", "List of favorite contacts");
		insertGroup(user_id, "Emergency", "List of emergency contacts");
		insertContact(user_id, req.body.firstName, req.body.lastName, req.body.alias, req.body.company, req.body.address);
		if (req.body.phones) {
			req.body.phones.forEach((phone) => {
				insertContactPhone(user_id, 1, phone.type, phone.code, phone.number);
			});
		}
		if (req.body.emails) {
			req.body.emails.forEach((email) => {
				const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
				if (!regex.test(email.direction)) {
					res.status(400).send({ message: "Invalid email format" });
					return;
				}
				insertContactEmail(user_id, 1, email.type, email.direction);
			});
		}
		if (req.body.dates) {
			req.body.dates.forEach((date) => {
				const regex = /^\d{4}-\d{2}-\d{2}$/;
				if (!regex.test(date.date)) {
					res.status(400).send({ message: "Invalid date format" });
					return;
				}
				insertContactDate(user_id, 1, date.type, date.date);
			});
		}
		if (req.body.urls) {
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
