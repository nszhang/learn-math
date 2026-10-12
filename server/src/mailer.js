// Email transport (nodemailer) configured from env vars:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// When SMTP_HOST is absent the mailer is a no-op (returns {skipped}) so the
// app runs fine before credentials are provisioned.
import nodemailer from 'nodemailer';

export function createMailer(opts = {}) {
  const HOST = opts.host ?? process.env.SMTP_HOST;
  const PORT = Number(opts.port ?? process.env.SMTP_PORT ?? 587);
  const USER = opts.user ?? process.env.SMTP_USER;
  const PASS = opts.pass ?? process.env.SMTP_PASS;
  const FROM = opts.from ?? process.env.SMTP_FROM ?? "MathAce <no-reply@math.pnpsolutions.ca>";

  if (!HOST) {
    return {
      configured: false,
      from: FROM,
      async send() { return { skipped: true, reason: 'SMTP not configured' }; }
    };
  }

  const transport = nodemailer.createTransport({
    host: HOST, port: PORT,
    secure: PORT === 465,
    auth: USER ? { user: USER, pass: PASS } : undefined
  });

  return {
    configured: true,
    from: FROM,
    async send({ to, subject, html }) {
      const info = await transport.sendMail({ from: FROM, to, subject, html });
      return { messageId: info.messageId };
    }
  };
}
