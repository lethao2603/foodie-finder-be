const nodemailer = require("nodemailer");
const {EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_SENDER_PASS, EMAIL_SENDER_USER, EMAIL_SERVICE} = require('../constants/config.constant')
module.exports = async (email, subject, htmlContent) => {
	try {
		const transporter = nodemailer.createTransport({
			host: EMAIL_HOST,
			service: EMAIL_SERVICE,
			port: Number(EMAIL_PORT),
			secure: Boolean(EMAIL_SECURE),
			auth: {
				user: EMAIL_SENDER_USER,
				pass: EMAIL_SENDER_PASS,
			},
		});

		await transporter.sendMail({
			from: EMAIL_SENDER_USER,
			to: email,
			subject: subject,
			html: htmlContent,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};