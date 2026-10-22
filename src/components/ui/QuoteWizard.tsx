import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/site';
import { PRODUCTS } from '../../data/products';
import { CaretRight, CaretLeft, CheckCircle, EnvelopeSimple, PaperPlaneRight } from '@phosphor-icons/react';
import { IconCementBag, IconTruckCistern } from '../icons/IndustryIcons';
import { api } from '../../lib/api';

interface QuoteWizardProps {
  initialProductId?: string;
  onClose?: () => void;
}

const DEPARTMENTS = [
  'Littoral (Cotonou)',
  'Atlantique (Abomey-Calavi, Ouidah, Allada)',
  'Ouémé (Porto-Novo, Sèmè-Kpodji)',
  'Plateau (Pobè, Sakété, Massé, Kétou)',
  'Zou (Bohicon, Abomey)',
  'Collines (Dassa, Savè)',
  'Borgou (Parakou)',
  'Alibori (Kandi, Malanville)',
  'Donga (Djougou)',
  'Atacora (Natitingou)',
  'Mono (Lokossa, Grand-Popo)',
  'Couffo (Aplahoué, Dogbo)'
];

export const QuoteWizard: React.FC<QuoteWizardProps> = ({ initialProductId, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [product, setProduct] = useState<string>(initialProductId || 'cpj-45');
  const [format, setFormat] = useState<'Sacs 50kg' | 'Vrac Citerne'>('Sacs 50kg');
  const [quantity, setQuantity] = useState<string>('600 sacs (30T)');
  
  const [department, setDepartment] = useState<string>('Littoral (Cotonou)');
  const [commune, setCommune] = useState<string>('');
  const [siteDetails, setSiteDetails] = useState<string>('');
  
  const [clientType, setClientType] = useState<'Entreprise BTP' | 'Particulier' | 'Distributeur'>('Entreprise BTP');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const selectedProductObj = PRODUCTS.find((p) => p.id === product) || PRODUCTS[1];

  // Generate structured message
  const generateMessage = () => {
    return `DEMANDE DE DEVIS B2B - NOCIBÉ BÉNIN
--------------------------------------------
Client : ${fullName} ${companyName ? `(${companyName})` : ''}
Profil : ${clientType}
Téléphone : ${phone}
Email : ${email || 'Non renseigné'}

DÉTAILS PRODUIT :
- Produit : ${selectedProductObj.name} (${selectedProductObj.shortGrade})
- Conditionnement : ${format}
- Quantité estimée : ${quantity}

LIEU DE LIVRAISON :
- Département : ${department}
- Commune / Ville : ${commune || 'À préciser'}
- Précision chantier : ${siteDetails || 'Non spécifié'}

Remarques particulières : ${notes || 'Aucune'}
--------------------------------------------
Envoyé depuis le site officiel https://nocibe.bj`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [quoteReference, setQuoteReference] = useState<string>('');

  const handleApiSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.quotes.submit({
        nom: fullName,
        telephone: phone,
        email,
        produit: `${selectedProductObj.name} (${selectedProductObj.shortGrade})`,
        quantite: `${quantity} - ${format}`,
        unite: format === 'Vrac Citerne' ? 'tonnes' : 'sacs',
        departement: department,
        commune,
        siteDetails,
        message: notes,
      });
      setQuoteReference(res.quoteId || 'NOC-B2B');
      setSubmitSuccess(true);
    } catch {
      // Fallback vers client email si besoin
      window.location.href = getMailtoUrl();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`Demande de Devis B2B - ${selectedProductObj.name} - ${fullName}`);
    const body = encodeURIComponent(generateMessage());
    return `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0B1F3A] text-white p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00CCFF] block">
            Devis Express Sans Engagement
          </span>
          <h3 className="text-xl font-bold font-playfair">
            Simulateur de Devis B2B & Chantiers
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            Fermer
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#0B1F3A] font-bold' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>1</span>
          <span>Produit & Quantité</span>
        </div>
        <span className="text-slate-300">/</span>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#0B1F3A] font-bold' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>2</span>
          <span>Chantier</span>
        </div>
        <span className="text-slate-300">/</span>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#0B1F3A] font-bold' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>3</span>
          <span>Contact</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                1. Sélectionner le type de ciment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProduct(p.id)}
                    className={`p-3.5 text-left rounded-xl border-2 transition ${
                      product === p.id
                        ? 'border-[#0131FD] bg-blue-50/50 ring-2 ring-[#0131FD]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0B1F3A]">{p.shortGrade}</span>
                      {product === p.id && <CheckCircle size={18} weight="fill" className="text-[#0131FD]" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{p.targetUse}</div>
                    <div className="text-[11px] font-semibold text-[#16A34A] mt-1">{p.resistance28d}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                2. Mode de conditionnement
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormat('Sacs 50kg')}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                    format === 'Sacs 50kg'
                      ? 'border-[#0B1F3A] bg-slate-50 ring-2 ring-[#0B1F3A]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <IconCementBag size={28} className="text-[#0B1F3A]" />
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#0B1F3A]">Sacs de 50 kg</div>
                    <div className="text-xs text-slate-500">Palette ou vrac bâché</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('Vrac Citerne')}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                    format === 'Vrac Citerne'
                      ? 'border-[#0B1F3A] bg-slate-50 ring-2 ring-[#0B1F3A]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <IconTruckCistern size={28} className="text-[#0B1F3A]" />
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#0B1F3A]">Vrac Citerne</div>
                    <div className="text-xs text-slate-500">Pour silos & centrales</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                3. Quantité souhaitée
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] font-medium text-slate-800 bg-white"
              >
                <option value="600 sacs (30T - 1 Camion complet)">600 sacs (30 Tonnes - 1 camion semi-remorque direct usine)</option>
                <option value="1200 sacs (60T - 2 Camions)">1 200 sacs (60 Tonnes - 2 camions)</option>
                <option value="3000 sacs (150T - Gros œuvre)">3 000 sacs (150 Tonnes - Gros chantier)</option>
                <option value="1 Citerne Vrac (35T)">1 Citerne pulvérulente Vrac (35 Tonnes)</option>
                <option value="Multiples Citernes (> 100T)">Fourniture continue vrac (&gt; 100 Tonnes)</option>
                <option value="Inférieur à 30T (Comptoir local)">Inférieur à 30 Tonnes (Orientation vers dépôt agréé)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2"
              >
                <span>Continuer vers le chantier</span>
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                Département de livraison au Bénin *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] font-medium text-slate-800 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                Commune / Arrondissement / Quartier *
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Ex : Cotonou Akpakpa, Abomey-Calavi Arconville, Parakou..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                Type de chantier / Accès camion
              </label>
              <input
                type="text"
                value={siteDetails}
                onChange={(e) => setSiteDetails(e.target.value)}
                placeholder="Ex: Immeuble R+3, voie goudronnée accessible semi-remorque..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-slate-800"
              />
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-50"
              >
                <CaretLeft size={16} weight="bold" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2"
              >
                <span>Coordonnées de contact</span>
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                Vous êtes :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Entreprise BTP', 'Particulier', 'Distributeur'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setClientType(type)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                      clientType === type
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Koffi Mensah"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                  Entreprise / Société
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex : Bâtir Bénin SARL"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                  Numéro de téléphone (Format Bénin 10 chiffres) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex : +229 01 47 81 67 78"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                  Adresse Email (optionnel)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.bj"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                Remarques ou spécifications techniques
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex : Besoin d'une livraison échelonnée sur 3 semaines, déchargement sur place..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] text-sm"
              />
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-50"
              >
                <CaretLeft size={16} weight="bold" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                disabled={!fullName || !phone}
                onClick={() => {
                  setStep(4);
                  api.quotes.submit({
                    nom: fullName + (companyName ? ` (${companyName})` : ''),
                    telephone: phone,
                    email: email,
                    produit: selectedProductObj.name,
                    quantite: quantity,
                    unite: format,
                    departement: department,
                    commune: commune,
                    siteDetails: siteDetails,
                    message: notes,
                  }).catch(() => {});
                }}
                className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Vérifier & Envoyer</span>
                <CheckCircle size={18} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & DISPATCH CHANNELS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-2.5">
              <div className="font-bold text-[#0B1F3A] border-b border-slate-200 pb-2">
                Récapitulatif de votre demande :
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Ciment sélectionné :</span>
                <span className="font-bold text-[#0B1F3A]">{selectedProductObj.name} ({format})</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Quantité :</span>
                <span className="font-bold text-[#0B1F3A]">{quantity}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Localisation :</span>
                <span className="font-bold text-[#0B1F3A]">{department} {commune ? `(${commune})` : ''}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Contact :</span>
                <span className="font-bold text-[#0B1F3A]">{fullName} - {phone}</span>
              </div>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle size={44} weight="fill" className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-lg">Demande de devis transmise avec succès !</h4>
                <p className="text-sm text-emerald-800">
                  Votre demande a été enregistrée sous la référence <strong className="font-mono">{quoteReference}</strong>. Notre direction commerciale prendra contact avec vous dans les plus brefs délais.
                </p>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Fermer la fenêtre
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm font-semibold text-[#0B1F3A]">
                  Transmettre directement votre demande au service commercial :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Direct API Dispatch */}
                  <button
                    type="button"
                    onClick={handleApiSubmit}
                    disabled={isSubmitting}
                    className="bg-[#0131FD] hover:bg-[#0026C7] disabled:bg-slate-400 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <PaperPlaneRight size={22} weight="fill" />
                    <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}</span>
                  </button>

                  {/* Email Dispatch */}
                  <a
                    href={getMailtoUrl()}
                    className="bg-[#07142A] hover:bg-[#0D2447] text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
                  >
                    <EnvelopeSimple size={22} weight="bold" />
                    <span>Transmettre par Email</span>
                  </a>
                </div>

                <p className="text-xs text-slate-500">
                  Votre demande est directement enregistrée et affectée à un conseiller grands comptes à l'usine de Massé.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium text-xs flex items-center gap-1 hover:bg-slate-50"
              >
                <CaretLeft size={14} weight="bold" />
                <span>Modifier les informations</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
