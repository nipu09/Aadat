const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function verificationEmail({ name, code, ttlMinutes }) {
  const subject = `${code} is your AAdat verification code`;

  const text =
    `Hi ${name},\n\n` +
    `Your AAdat verification code is: ${code}\n\n` +
    `It expires in ${ttlMinutes} minutes. If you didn't sign up, you can ignore this email.\n`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f6e7c1;color:#3a2230">
    <h1 style="margin:0 0 16px;color:#c4452b">AAdat</h1>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Use this code to verify your email:</p>
    <p style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#fff6dc;border:3px solid #3a2230;padding:12px 16px;text-align:center">${escapeHtml(code)}</p>
    <p>It expires in ${ttlMinutes} minutes. If you didn't sign up, you can safely ignore this email.</p>
  </div>`;

  return { subject, text, html };
}

module.exports = verificationEmail;
