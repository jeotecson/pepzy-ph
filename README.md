# Pepzy Website — Contact Form Setup

This project includes a client contact form and a serverless contact API compatible with Vercel. The serverless endpoint prefers SendGrid (free tier) and falls back to Resend if configured. A local PHP fallback (`contact.php`) is included for quick local testing.

## What I added
- Contact form in `index.html` (before footer)
- Client handler in `assets/app.js` (tries `/api/contact`, falls back to `/contact.php`)
- Serverless endpoint: `api/contact.js` (SendGrid first, Resend fallback)
- Local PHP endpoint: `contact.php` (keeps working for local PHP dev)
- `.env.example` with recommended env vars

## Quick setup (SendGrid, recommended)
1. Create a SendGrid account: https://sendgrid.com (free tier available).
2. Verify sender identity (Single Sender Verification) or authenticate domain:
   - Dashboard → Sender Authentication → Single Sender Verification → add `jeotecson13@gmail.com` (or your verified sender).
3. Create an API Key: Dashboard → Settings → API Keys → Create Key (Mail Send permissions).
4. In your Vercel project settings add an Environment Variable:
   - Key: `SENDGRID_API_KEY`
   - Value: your SendGrid API key
   - Environment: Production (and Preview if you want preview testing)

Optional: Add `RESEND_API_KEY` in Vercel settings as a fallback (if you want Resend available).

## Local testing (quick)
- Start the PHP dev server (client will fall back to `contact.php` locally):
```powershell
php -S localhost:8000
```
- Open `http://localhost:8000/index.html` and submit the contact form. The PHP endpoint returns JSON and attempts to use `mail()` (may fail on local Windows). Use SendGrid on Vercel for reliable delivery.

## Deploy to Vercel
1. Push your repo to GitHub:
```bash
git add -A
git commit -m "Add contact form and serverless contact API"
git push origin main
```
2. In Vercel dashboard, import the GitHub repo and deploy.
3. Add the `SENDGRID_API_KEY` env var in Vercel as described above.

## Verified sender
- The serverless code uses `jeotecson13@gmail.com` as the `from` address. Verify this email in SendGrid (Single Sender Verification) or authenticate a domain for higher deliverability.

## Troubleshooting
- If the serverless function returns a 500, check Vercel function logs for details. The endpoint will return `provider` in the JSON when successful (e.g., `provider: "sendgrid"`).
- If using local PHP fallback, `mail()` often fails on Windows — this is expected unless you configure SMTP.

## Changing behavior
- To switch providers or change the `from` address, edit `api/contact.js` and redeploy.

If you want, I can also add a scripted `vercel` CLI workflow or configure PHPMailer + SMTP for non-serverless hosts. Want me to add the README section for SendGrid sender verification steps with screenshots? 
