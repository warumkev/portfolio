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
        const html = `
                    <div style="background:linear-gradient(135deg,#18181b 0%,#27272a 100%);padding:2rem 0;min-height:100vh;font-family:'Inter',Arial,sans-serif;color:#fafafa;">
                        <div style="max-width:480px;margin:2rem auto;background:#232323;border-radius:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.18);padding:2rem 2.5rem;">
                            <h2 style="font-size:2rem;font-weight:700;margin-bottom:1.5rem;letter-spacing:-1px;color:#38bdf8;">Neue Kontaktanfrage</h2>
                            <div style="margin-bottom:1.2rem;">
                                <span style="font-weight:600;color:#a3e635;">Name:</span>
                                <span style="margin-left:0.5rem;">${name}</span>
                            </div>
                            <div style="margin-bottom:1.2rem;">
                                <span style="font-weight:600;color:#a3e635;">E-Mail:</span>
                                <span style="margin-left:0.5rem;">${email}</span>
                            </div>
                            <div style="margin-bottom:1.2rem;">
                                <span style="font-weight:600;color:#f472b6;">Nachricht:</span>
                                <div style="margin:0.5rem 0 0 0.5rem;padding:1rem;background:#18181b;border-radius:0.75rem;color:#fafafa;white-space:pre-line;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                            </div>
                            <div style="margin-top:2rem;font-size:0.95rem;color:#a1a1aa;">Portfolio Kontaktformular 13 kevintamme.com</div>
                        </div>
                    </div>
                `;
        const text = `Neue Kontaktanfrage\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`;
        await resend.emails.send({
            from: 'Portfolio Kontakt <noreply@kevintamme.com>',
            to: 'weristkevintamme@gmail.com',
            subject: `Neue Nachricht von ${name}`,
            text,
            html,
            replyTo: email,
        });
        return res.status(200).json({ message: 'Nachricht gesendet!' });
    } catch {
        return res.status(500).json({ message: 'Fehler beim Senden der Nachricht.' });
    }
}
