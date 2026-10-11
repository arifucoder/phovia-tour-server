/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

// jehetu ami esm moduler patern use korchi and commonjs nah ei jonno amake filename evabe ante hobe. filename directly likhle hobe nah
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
	// port: envVars.EMAIL_SENDER.SMTP_PORT,
	secure: true,
	auth: {
		user: envVars.EMAIL_SENDER.SMTP_USER,
		pass: envVars.EMAIL_SENDER.SMTP_PASS,
	},
	port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
	host: envVars.EMAIL_SENDER.SMTP_HOST,
});

interface SendEmailOptions {
	to: string;
	subject: string;
	templateName: string;
	templateData?: Record<string, any>;
	attachments?: {
		filename: string;
		content: Buffer | string;
		contentType: string;
	}[];
}

export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendEmailOptions) => {
	try {
		const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
		const html = await ejs.renderFile(templatePath, templateData);

		// **it was for check why email is not sending
		// const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = envVars.EMAIL_SENDER;

		// console.log("SMTP config check:", {
		// 	host: SMTP_HOST,
		// 	port: SMTP_PORT,
		// 	portType: typeof SMTP_PORT,
		// 	user: JSON.stringify(SMTP_USER),
		// 	from: SMTP_FROM,
		// 	passLength: SMTP_PASS?.length,
		// 	passPreview: SMTP_PASS ? `${SMTP_PASS.slice(0, 2)}...${SMTP_PASS.slice(-2)}` : SMTP_PASS,
		// 	passHasSpace: SMTP_PASS?.includes(" "),
		// 	passHasQuote: /["']/.test(SMTP_PASS ?? ""),
		// });

		const info = await transporter.sendMail({
			from: envVars.EMAIL_SENDER.SMTP_FROM,
			to: to,
			subject: subject,
			html: html,
			attachments: attachments?.map((attachment) => ({
				filename: attachment.filename,
				content: attachment.content,
				contentType: attachment.contentType,
			})),
		});
		console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
	} catch (error: any) {
		console.log("email sending error", error.message);
		throw new AppError(500, "Failed to send email");
	}
};
