import { getResetKeys, deleteResetKey } from "../utils/resetKeys.js";
import { updateUserPassword, getUserByEmail } from "../utils/DBComponent.js";
import { sendEmail } from "../utils/mailerComponent.js";
import bcrypt from "bcrypt";

export async function recoveryPassword(req, res) {
	if (!req.body.email || !req.body.newPassword || !req.body.code) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}
	try {
		const user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}
		const keys = getResetKeys();
		if (!keys[user.id]) {
			res.status(400).send({ message: "No recovery code sent" });
			return;
		}
		if (!keys[user.id].wasUsed) {
			res.status(400).send({ message: "Something went wrong" });
			return;
		}
		if (keys[user.id].key !== req.body.code) {
			res.status(400).send({ message: "Invalid code" });
			return;
		}
		const newPassword = await bcrypt.hash(req.body.newPassword, 10);
		const result = await updateUserPassword(user.id, newPassword);
		if (!result) {
			res.status(500).send({ message: "Error updating password" });
			return;
		}
		deleteResetKey(user.id);
		const email = req.body.email;
		const subject = "ContactSync - Password changed";
		const body = `
<html>
	<head>
		<style>
			body {
			  font-family: Arial, sans-serif;
			  line-height: 1.5;
			}
			h2 {
			  color: #cf6b6b;
			}
			p {
			  margin-bottom: 10px;
			}
			strong {
			  color: #007bff;
			}
		</style>
	</head>
	<body>
		<h2>Password Updated</h2>
        <p>Dear User,</p>
        <p>Your password has been successfully updated.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <p>Best regards,</p>
        <p>ContactSync</p>
	</body>
</html>`;
		const type = "html";
		sendEmail({ email, subject, body, type });
		res.status(200).send({ message: "Password updated" });
	} catch (error) {
		res.status(500).send({ message: "Internal server error" });
	}
}
