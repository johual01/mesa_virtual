import nodemailer from 'nodemailer';
import config from './env';

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOSTNAME,
    port: config.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
    },
});

export async function sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
        from: '"Sender Name" <your-email@example.com>',
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: %s', error);
        throw error;
    }
}