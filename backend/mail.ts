import nodemailer from 'nodemailer';
import config from './env';
import Mail from './models/Mail';

// Cambiar a true para enviar correos reales
const SEND_REAL_EMAILS = false;

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
    const from = '"Mesa Virtual" <noreply@mesavirtual.com>';
    
    const mailData = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        // Guardar en la base de datos
        const savedMail = new Mail({
            ...mailData,
            status: SEND_REAL_EMAILS ? 'pending' : 'sent'
        });
        await savedMail.save();

        // Si está habilitado, enviar correo real
        if (SEND_REAL_EMAILS) {
            const info = await transporter.sendMail(mailData);
            console.log('Message sent: %s', info.messageId);
            
            // Actualizar estado a enviado
            savedMail.status = 'sent';
            await savedMail.save();
            
            return info;
        }

        console.log('Email saved to DB (not sent):', { to, subject });
        return { messageId: savedMail._id, saved: true };
    } catch (error) {
        console.error('Error sending/saving email: %s', error);
        throw error;
    }
}