const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://amitdhakar218.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, subject, message, imageUrl, videoUrl, linkUrl } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    let html = `<p><b>From:</b> ${email}</p><p><b>Subject:</b> ${subject || '(no subject)'}</p><p><b>Message:</b><br/>${message}</p>`;
    if (imageUrl) html += `<p><b>Image:</b><br/><a href="${imageUrl}">${imageUrl}</a><br/><img src="${imageUrl}" style="max-width:400px; margin-top:8px;" /></p>`;
    if (videoUrl) html += `<p><b>Video:</b> <a href="${videoUrl}">${videoUrl}</a></p>`;
    if (linkUrl) html += `<p><b>Link:</b> <a href="${linkUrl}">${linkUrl}</a></p>`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || 'New message'}`,
      html
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
