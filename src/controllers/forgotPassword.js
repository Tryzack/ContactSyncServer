import { getUserByEmail } from "../utils/DBComponent.js";
import { sendEmail } from "../utils/mailerComponent.js";
import { deleteResetKey, getResetKeys, setResetKey } from "../utils/resetKeys.js";

/**
 * Send an email with a recovery code to reset the password
 * @param {String} req.body.email - Required
 */
export async function forgotPassword(req, res) {
	if (!req.body.email) {
		res.status(400).send({ message: "Missing fields" });
		return;
	}

	const keys = getResetKeys();
	let user;
	try {
		user = await getUserByEmail(req.body.email);
		if (!user) {
			res.status(400).send({ message: "User does not exist" });
			return;
		}
		if (keys[user.id]) {
			res.status(400).send({ message: "A recovery email has already been sent" });
			return;
		}
		const code = Math.floor(100000 + Math.random() * 900000);
		setResetKey(user.id, { email: req.body.email, key: code, wasUsed: false });
		const email = req.body.email;
		const subject = "ContactSync - Password recovery";
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
		<h2>Password Recovery</h2>
		<p>Dear User,</p>
		<p>We have received a request for password recovery for your account.</p>
		<p>Your recovery code is:</p>
		<div style="
		display: flex; 
		background-color: #316fad; 
		padding: 10px; 
		margin: 0 auto; 
		height: 30px; 
		width: 50%;"
		>
			<p style="
			font-size: 20px;
			color: white;
			text-align: center;
            margin: 0;
			width: 100%;
			">${code}<p>
		</div>
		<p>Please use this code to reset your password. This code will expire in 10 minutes.</p>
		<p>If you did not request this password recovery, please ignore this email.</p>
		<p>Thank you,</p>
		<p style="color: #2b960b">ContactSync Team</p>
	</body>
</html>`;
		const type = "html";
		sendEmail({ email, subject, body, type }).then((response) => {
			setTimeout(() => {
				if (keys[user.id]) deleteResetKey(user.id);
			}, 600000);
			res.status(200).send({ message: "Email sent" });
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error sending email" });
		if (keys[user.id]) deleteResetKey(user.id);
	}
}
