import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { restaurantName, yourName, emailAddress, phoneNumber, message } = await request.json();

    if (!restaurantName || !yourName || !emailAddress || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Default configuration for ease of use. Replace with your actual SMTP details in .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'manager@riznex.com', // Who receives the leads
      replyTo: emailAddress,
      subject: `New Consultation Request from ${restaurantName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #E5B869; margin-top: 0;">New Consultation Request</h2>
          <p>A new lead has submitted a consultation request via the Riznex website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Restaurant Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${restaurantName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Contact Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${yourName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${emailAddress}">${emailAddress}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${phoneNumber || 'Not provided'}</td>
            </tr>
          </table>

          <h3 style="margin-top: 25px;">Message / Assistance Needed:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #E5B869; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Email sending error:', error);
    // Even if it fails (e.g. SMTP not configured yet), return success to UI for demonstration purposes if needed,
    // but better to return 500 so they know they need to configure SMTP.
    return NextResponse.json({ error: 'Failed to send email. Check SMTP configuration.' }, { status: 500 });
  }
}
