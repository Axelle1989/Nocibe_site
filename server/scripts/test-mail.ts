import nodemailer from 'nodemailer';
import { ENV } from '../src/config/env.js';

async function main() {
  const recipient = process.argv[2];
  if (!recipient) {
    console.error('❌ Erreur : Veuillez spécifier une adresse email destinataire.');
    console.error('Usage : npm --prefix server run mail:test -- votre-email@domaine.com');
    process.exit(1);
  }

  console.log(`📡 Test de configuration SMTP vers : ${recipient}`);
  console.log(`• Serveur SMTP : ${ENV.SMTP_HOST}:${ENV.SMTP_PORT}`);
  console.log(`• Expéditeur (MAIL_FROM) : ${ENV.MAIL_FROM}`);
  console.log(`• Utilisateur SMTP : ${ENV.SMTP_USER ? ENV.SMTP_USER.slice(0, 4) + '***' : 'Non configuré'}`);

  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
    console.error('❌ Échec : Paramètres SMTP incomplets dans les variables d\'environnement.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  try {
    console.log('🔄 Vérification de la connexion au serveur SMTP (transporter.verify)...');
    await transporter.verify();
    console.log('✅ Connexion SMTP validée avec succès !');

    console.log(`📧 Envoi d'un email de test à ${recipient}...`);
    const info = await transporter.sendMail({
      from: ENV.MAIL_FROM,
      to: recipient,
      subject: 'NOCIBÉ S.A. — Test de distribution SMTP',
      text: 'Ceci est un message de test envoyé depuis le serveur d\'API NOCIBÉ via le service Brevo SMTP.',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <h2 style="color: #0B1F3A;">NOCIBÉ S.A. — Test de distribution</h2>
          <p>La passerelle d'envoi d'e-mails fonctionne parfaitement.</p>
          <p style="font-size: 12px; color: #64748B;">Date d'envoi : ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    });

    console.log(`✅ Message envoyé avec succès (ID: ${info.messageId})`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Échec de l\'envoi du message :');
    console.error(error.message || error);
    process.exit(1);
  }
}

main();

