const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, body }) => {
  // If SMTP is configured in env, send real email, else simulate
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'WorkArea'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@workarea.com'}>`,
        to,
        subject,
        text: body,
        html: body.replace(/\n/g, '<br>'),
      });
      console.log(`[Email Service] Sent email to ${to} with subject "${subject}"`);
      return true;
    } catch (err) {
      console.error(`[Email Service] Failed to send email to ${to}:`, err.message);
      return false;
    }
  } else {
    console.log(`
============================================================
[SIMULATED EMAIL SENT]
To: ${to}
Subject: ${subject}
Body:
${body}
============================================================
    `);
    return true;
  }
};

const sendSMS = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (accountSid && authToken && fromNumber) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', fromNumber);
      params.append('Body', body);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Twilio returned status ${res.status}: ${errorText}`);
      }

      console.log(`[SMS Service] Sent message to ${to} via Twilio`);
      return true;
    } catch (err) {
      console.error(`[SMS Service] Failed to send SMS to ${to}:`, err.message);
      return false;
    }
  } else {
    // Simulate sending SMS, print to console
    console.log(`
============================================================
[SIMULATED SMS SENT]
To: ${to}
Body:
${body}
============================================================
    `);
    return true;
  }
};

module.exports = { sendEmail, sendSMS };
