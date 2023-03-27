const nodemailer = require('nodemailer');

require('dotenv').config();

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendNoticeMail(to, subject, html) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text: '',
            html
        })
    }
}

module.exports = new MailService();