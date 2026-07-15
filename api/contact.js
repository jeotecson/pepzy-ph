export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const toAddress = 'jeotecson13@gmail.com';
  const mailHtml = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111; line-height:1.5;">
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || 'Website Inquiry')}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    </div>
  `;

  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    // Try SendGrid first if configured
    if (SENDGRID_API_KEY) {
      const payload = {
        personalizations: [{ to: [{ email: toAddress }], subject: `Website Contact: ${subject || 'No subject'}` }],
        from: { email: 'jeotecson13@gmail.com', name: 'Pepzy Website' },
        content: [{ type: 'text/html', value: mailHtml }],
      };

      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (sgRes.ok) {
        return res.status(200).json({ success: true, provider: 'sendgrid' });
      }

      const errText = await sgRes.text().catch(() => '');
      console.error('SendGrid error:', sgRes.status, errText);
      // fall through to try Resend if available
    }

    // Fallback to Resend if SendGrid not configured or failed
    if (RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({
            from: 'Pepzy Website <jeotecson13@gmail.com>',
          to: [toAddress],
          subject: `Website Contact: ${subject || 'No subject'}`,
          html: mailHtml,
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Resend API error:', response.status, err);
        return res.status(500).json({ error: 'Email send failed' });
      }

      return res.status(200).json({ success: true, provider: 'resend' });
    }

    console.error('No email provider configured (SENDGRID_API_KEY or RESEND_API_KEY)');
    return res.status(500).json({ error: 'Email provider not configured' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
