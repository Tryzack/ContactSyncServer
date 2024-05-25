import { getUserByEmail } from "../utils/DBComponent.js";
import { sendEmail } from "../utils/mailerComponent.js";

export async function forgotPassword(req, res) {
	if (req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	if (!req.body.email) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}
		// generate 6 digit code and send it to user email
		const code = Math.floor(100000 + Math.random() * 900000);

		res.status(200).send({ message: "Email sent" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error sending email" });
	}
}
