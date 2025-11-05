// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { name, email, message } = req.body || {};
    if (!email || !message) return res.status(400).json({ error: 'Email y mensaje son obligatorios' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 587,
      secure: false, // true si usas 465
      auth: {
        user: process.env.ZOHO_USER,     // ej: info@paseoslugo.com
        pass: process.env.ZOHO_APP_PASS, // contraseña de app Zoho
      },
    });

    await transporter.sendMail({
      from: `"Web Paseos Lugo" <info@paseoslugo.com>`,
      to: 'info@paseoslugo.com',
      subject: `Nuevo mensaje de ${name || 'Formulario'}`,
      text: `Nombre: ${name || '-'}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><b>Nombre:</b> ${name || '-'}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mensaje:</b></p>
        <p>${(message || '').replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error enviando email:', err);
    return res.status(500).json({ error: 'No se pudo enviar el email' });
  }
}