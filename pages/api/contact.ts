import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'Portfolio Kontakt <noreply@kevintamme.com>',
            to: 'weristkevintamme@gmail.com',
            subject: `Neue Nachricht von ${name}`,
            text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
            replyTo: email,
        });
        return res.status(200).json({ message: 'Nachricht gesendet!' });
    } catch (error) {
        return res.status(500).json({ message: 'Fehler beim Senden der Nachricht.' });
    }
}
