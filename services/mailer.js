const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : null
});

/**
 * Sends Onboarding Verification Email to newly provisioned client admins
 */
async function sendVerificationEmail(recipientEmail, recipientName, verificationToken, subdomain) {
  const protocol = process.env.PROTOCOL || 'http';
  const mainHost = process.env.MAIN_HOST || 'localhost:3000';
  
  const verificationUrl = `${protocol}://${mainHost}/api/auth/verify-email?token=${verificationToken}`;
  const portalUrl = subdomain ? `${protocol}://${subdomain}.${mainHost}` : `${protocol}://${mainHost}`;

  const mailOptions = {
    from: '"SrijanDev Platform Hub" <no-reply@srijandev.in>',
    to: recipientEmail,
    subject: 'Activate Your SrijanDev Operations Portal Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f9fafb; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1f2937; border-radius: 12px; border: 1px solid #374151; padding: 30px; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 1px; }
          .subtitle { font-size: 11px; color: #9ca3af; text-transform: uppercase; margin-top: 4px; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #374151; font-size: 12px; color: #6b7280; }
          .code-box { background: #0b0f19; padding: 12px; border-radius: 6px; font-family: monospace; color: #38bdf8; word-break: break-all; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">SrijanDev</div>
            <div class="subtitle">OPERATIONS & MANAGEMENT PORTAL</div>
          </div>
          <h2>Welcome, ${recipientName}!</h2>
          <p>Super-Admin <strong>Rajesh Bhatti</strong> has provisioned your client portal: <strong>${portalUrl}</strong>.</p>
          <p>Please click the activation button below to verify your email and set up portal access:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="btn">Verify Email & Activate Portal</a>
          </div>

          <p>Or paste this activation link into your browser:</p>
          <div class="code-box">${verificationUrl}</div>

          <p><em>Unverified accounts cannot log into any client portal. Link expires in 24 hours.</em></p>

          <div class="footer">
            SrijanDev Operations & Management Portal &bull; Owner: Rajesh Bhatti (rajeshbhatti89@gmail.com)
          </div>
        </div>
      </body>
      </html>
    `
  };

  console.log('\n==================================================');
  console.log(`[EMAIL NOTICE] Verification link for ${recipientEmail}:`);
  console.log(`VERIFY URL: ${verificationUrl}`);
  console.log('==================================================\n');

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`[Nodemailer] Email dispatched to ${recipientEmail}`);
    }
  } catch (err) {
    console.warn(`[Nodemailer Warning] ${err.message}`);
  }

  return verificationUrl;
}

module.exports = {
  sendVerificationEmail
};
