import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SITE_CONFIG } from '../config/site';

interface LegalPageProps {
  type: 'legal' | 'privacy';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow={isPrivacy ? 'Protection des Données Personnelles' : 'Informations Légales & Réglementaires'}
          titleBeforeItalic={isPrivacy ? 'Politique de' : 'Mentions'}
          italicWord={isPrivacy ? 'confidentialité' : 'légales'}
          titleAfterItalic={isPrivacy ? '& cookies' : '& conformité'}
          subtitle="Transparence et respect des lois en vigueur en République du Bénin (Loi n° 2017-20 portant Code du Numérique et APDP)."
        />

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {!isPrivacy ? (
            <>
              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">1. Éditeur du Site</h3>
                <p>
                  Le présent site officiel est édité par la société <strong>Nouvelle Cimenterie du Bénin (NOCIBÉ) S.A.</strong>, société anonyme avec conseil d'administration de droit béninois, immatriculée au Registre du Commerce et du Crédit Mobilier (RCCM) de Cotonou.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Siège Social :</strong> {SITE_CONFIG.headquarters.address}</li>
                  <li><strong>Site Industriel :</strong> {SITE_CONFIG.factory.address}</li>
                  <li><strong>Téléphone officiel :</strong> {SITE_CONFIG.phoneMain}</li>
                  <li><strong>Email :</strong> {SITE_CONFIG.email}</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">2. Directeur de la Publication</h3>
                <p>
                  Le Directeur de la Publication est le Représentant Légal de la Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">3. Propriété Intellectuelle</h3>
                <p>
                  L'ensemble des marques, logos, visuels, photographies industrielles, textes et fiches techniques présents sur ce site sont la propriété exclusive de NOCIBÉ S.A. Toute reproduction, totale ou partielle, sans accord écrit préalable est formellement interdite.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">4. Normes & Spécifications Produits</h3>
                <p>
                  Les ciments NOCIBÉ CPJ 35, CPJ 45 et CPA 55 sont certifiés conformes à la norme harmonisée <strong>EN 197-1</strong> et contrôlés sous l'égide du CNERTP et d'organismes tiers indépendants.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">1. Collecte et Traitement des Données</h3>
                <p>
                  NOCIBÉ S.A. s'engage à protéger la vie privée des utilisateurs de sa plateforme web et de son espace client conformément aux dispositions de la <strong>Loi n° 2017-20 du 20 avril 2018 portant Code du Numérique en République du Bénin</strong> et sous le contrôle de l'Autorité de Protection des Données Personnelles (APDP).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">2. Finalités des Données Collectées</h3>
                <p>
                  Les informations recueillies via les formulaires de devis, de contact ou lors de la création d'un compte client sécurisé ont pour finalités exclusives :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Le traitement, la facturation et le suivi logistique des commandes de ciment ;</li>
                  <li>L'envoi des notifications d'expédition et de livraison ;</li>
                  <li>La réponse aux demandes d'assistance technique de dosage béton ;</li>
                  <li>L'envoi des actualités relatives aux nouveaux liants hydrauliques (sous réserve d'accord explicite).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold font-playfair text-[#0B1F3A]">3. Droits des Utilisateurs</h3>
                <p>
                  Chaque client dispose d'un droit permanent d'accès, de rectification, de portabilité et de suppression de ses données personnelles directement depuis son profil dans l'espace client ou en adressant un email à <code>{SITE_CONFIG.email}</code>.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
