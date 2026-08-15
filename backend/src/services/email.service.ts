import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

/**
 * Send 6-Digit OTP Verification Email via Gmail SMTP
 */
export const sendOtpEmail = async (toEmail: string, otpCode: string, name?: string) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 30px; borderRadius: 16px; max-width: 500px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #38bdf8; font-size: 24px; margin: 0;">⚡ CartMind AI</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Voice Commerce Security</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 14px; border: 1px solid #334155; text-align: center;">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">Password Verification Code</h3>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 20px;">
          Hi ${name || "Customer"}, use the 6-digit verification code below to verify your CartMind account request:
        </p>

        <div style="background-color: #0f172a; color: #4ade80; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 14px; border-radius: 10px; display: inline-block; margin: 16px 0; border: 1px solid #2563eb;">
          ${otpCode}
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
          This code expires in 10 minutes. If you did not request this code, please ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
        &copy; 2026 CartMind AI Commerce Platform. All rights reserved.
      </div>
    </div>
  `;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log(`[SMTP Simulator] Gmail credentials not set. Sent OTP ${otpCode} to ${toEmail}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: `"CartMind AI Security" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `⚡ ${otpCode} is your CartMind Verification Code`,
      html: htmlContent,
    });
    console.log(`[Gmail SMTP Success] OTP Email sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("[Gmail SMTP Error]", error);
    return { success: false, error };
  }
};

/**
 * Send Order Confirmation Email via Gmail SMTP
 */
export const sendOrderConfirmationEmail = async (toEmail: string, order: any) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 30px; borderRadius: 16px; max-width: 550px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #38bdf8; font-size: 24px; margin: 0;">⚡ CartMind AI</h2>
        <p style="color: #4ade80; font-size: 16px; font-weight: bold; margin-top: 4px;">Order Confirmed & Received! 🎉</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 14px; border: 1px solid #334155;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Order Number</span><br/>
            <strong style="color: #38bdf8; font-size: 18px;">${order.orderNumber || "ORD-8921"}</strong>
          </div>
          <div style="text-align: right;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase;">Status</span><br/>
            <strong style="color: #4ade80; font-size: 14px;">PROCESSING</strong>
          </div>
        </div>

        <p style="color: #cbd5e1; font-size: 14px;">
          Your order has been placed successfully and is being prepared for express delivery within 30-45 minutes.
        </p>

        <div style="background-color: #0f172a; padding: 14px; border-radius: 10px; margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #cbd5e1; font-size: 14px;">
            <span>Total Paid:</span>
            <strong style="color: #4ade80;">$${(order.totalAmount || 0).toFixed(2)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: #cbd5e1; font-size: 14px;">
            <span>Payment Method:</span>
            <span>${order.paymentMethod || "Cash on Delivery"}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log(`[SMTP Simulator] Gmail credentials not set. Sent Order Receipt to ${toEmail}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: `"CartMind AI Orders" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `🛍️ Order Confirmation #${order.orderNumber || "ORD-8921"} - CartMind AI`,
      html: htmlContent,
    });
    console.log(`[Gmail SMTP Success] Order Confirmation email sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("[Gmail SMTP Error]", error);
    return { success: false, error };
  }
};
