import nodemailer, { type Transporter } from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter: Transporter | null = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

const getClientBaseUrl = (): string => {
  const preferred = ENV.ALLOWED_ORIGINS.find((origin) => origin.includes('3001'));
  return preferred || ENV.ALLOWED_ORIGINS[0] || 'http://localhost:3001';
};

export const mailService = {
  async verifySmtp(): Promise<{ ok: boolean; error?: string }> {
    if (!transporter) {
      return { ok: false, error: 'Serveur SMTP non configuré' };
    }
    try {
      await transporter.verify();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Échec de connexion SMTP' };
    }
  },

  async sendVerificationEmail(email: string, prenom: string, token: string): Promise<boolean> {
    const clientBase = getClientBaseUrl();
    const verificationUrl = `${clientBase}/espace-client/verifier-email?token=${token}`;

    if (!ENV.IS_PRODUCTION) {
      console.log('\n================== EMAIL DE VÉRIFICATION ==================');
      console.log(`Destinataire : ${email}`);
      console.log(`[DEV] Lien de vérification : ${verificationUrl}`);
      console.log('===========================================================\n');
    }

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Vérification de votre compte NOCIBÉ</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden;">
          <tr>
            <td style="background-color: #0B1F3A; padding: 28px 32px; text-align: left;">
              <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">NOCIBÉ S.A.</h1>
              <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">Nouvelle Cimenterie du Bénin • Usine de Massé</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #0B1F3A; margin-top: 0; font-size: 20px;">Bienvenue chez NOCIBÉ, ${prenom} !</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                Merci d'avoir créé votre compte sur la plateforme officielle de la <strong>Nouvelle Cimenterie du Bénin</strong>.
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                Afin de sécuriser votre espace et de pouvoir passer vos commandes de ciment en ligne, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="background-color: #0131FD; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
                  Confirmer mon adresse email
                </a>
              </div>
              <p style="font-size: 13px; line-height: 1.5; color: #64748B;">
                Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :<br>
                <a href="${verificationUrl}" style="color: #0131FD; word-break: break-all;">${verificationUrl}</a>
              </p>
              <p style="font-size: 13px; color: #94A3B8; margin-top: 24px;">
                Ce lien expirera dans 24 heures. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message en toute sécurité.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F1F5F9; padding: 20px 32px; font-size: 12px; color: #64748B; text-align: center;">
              NOCIBÉ S.A. — Direction Commerciale & Logistique, Cotonou / Massé, République du Bénin.<br>
              Besoin d'assistance ? Contactez-nous à <a href="mailto:${ENV.HR_EMAIL}" style="color: #0131FD;">${ENV.HR_EMAIL}</a>.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: ENV.MAIL_FROM,
          to: email,
          subject: 'NOCIBÉ — Confirmez votre adresse email',
          html,
        });
        return true;
      } catch (err: any) {
        console.error('[SMTP ERROR] Échec de l\'envoi de l\'email de vérification :', err.message || err);
        return false;
      }
    }

    return false;
  },

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const clientBase = getClientBaseUrl();
    const resetUrl = `${clientBase}/espace-client/reinitialiser-mot-de-passe?token=${token}`;

    if (!ENV.IS_PRODUCTION) {
      console.log('\n================== EMAIL RÉINITIALISATION ==================');
      console.log(`Destinataire : ${email}`);
      console.log(`[DEV] Lien de réinitialisation : ${resetUrl}`);
      console.log('===========================================================\n');
    }

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Réinitialisation de mot de passe NOCIBÉ</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden;">
          <tr>
            <td style="background-color: #0B1F3A; padding: 28px 32px; text-align: left;">
              <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">NOCIBÉ S.A.</h1>
              <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">Sécurité du compte</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #0B1F3A; margin-top: 0; font-size: 20px;">Demande de réinitialisation de mot de passe</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                Une demande de réinitialisation de mot de passe a été effectuée pour votre compte NOCIBÉ.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background-color: #0131FD; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="font-size: 13px; line-height: 1.5; color: #64748B;">
                Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #0131FD; word-break: break-all;">${resetUrl}</a>
              </p>
              <p style="font-size: 13px; color: #94A3B8; margin-top: 24px;">
                Ce lien est valable 1 heure. Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message : votre compte reste sécurisé.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: ENV.MAIL_FROM,
          to: email,
          subject: 'NOCIBÉ — Réinitialisation de votre mot de passe',
          html,
        });
        return true;
      } catch (err: any) {
        console.error('[SMTP ERROR] Échec de l\'envoi de l\'email de réinitialisation :', err.message || err);
        return false;
      }
    }

    return false;
  },
};
