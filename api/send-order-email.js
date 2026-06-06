export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, name, email, productNames, receipt } = req.body;

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const attachments = [];

    if (receipt?.data && receipt?.name && receipt?.type) {
      attachments.push({
        type: receipt.type,
        name: receipt.name,
        data: receipt.data,
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Pepzy Orders <orders@yourdomain.com>', 
        to: [email],
        subject: `Order Successfully Placed! [${orderId}]`,
        html: `
          <div style="font-family: sans-serif; color: #111; line-height: 1.6;">
            <h2>Hi ${name},</h2>
            <p>Thank you for your order request for <strong>${productNames}</strong>.</p>
            <p>We have received your order details and your GoTyme payment receipt. Our team will verify the transaction and ship out your peptides shortly.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p>We will notify you once payment is confirmed.</p>
            <br>
            <p>Thank you,<br><strong>The Pepzy Team</strong></p>
          </div>
        `,
        attachments: attachments.length ? attachments : undefined,
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("Resend API Error:", errorData);
      return res.status(400).json({ error: errorData });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}