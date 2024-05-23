import nodemailer from "nodemailer";

export function sendEmail({ email, subject, body }) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAILPASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: subject,
		text: body,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			throw new Error(error);
		} else {
			return info.response;
		}
	});
}
