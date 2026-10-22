import React from 'react';
import { SITE_CONFIG, LOCATIONS } from '../../config/site';
import { Logo } from '../ui/Logo';
import { Stagger, StaggerItem } from '../motion/Stagger';
import { Reveal } from '../motion/Reveal';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  ShieldCheck,
  CheckCircle,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { FaLinkedinIn, FaFacebookF } from 'react-icons/fa6';
import { IconCementBag } from '../icons/IndustryIcons';

interface FooterProps {
  onNavigate: (page: string, extra?: string) => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQuote }) => {
  return (
    <footer className="bg-[#07142A] text-slate-300 pt-16 pb-24 md:pb-12 rounded-t-3xl md:rounded-t-[44px] border-t-[3px] border-[#0131FD] relative z-10 shadow-2xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Stagger
          staggerDelay={0.08}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800"
        >
          {/* Col 1: Brand with white pill logo & Certifications (4 cols) */}
          <StaggerItem className="lg:col-span-4 space-y-5">
            <Logo variant="footer" />

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm pt-2">
              La Nouvelle Cimenterie du Bénin (NOCIBÉ) produit et distribue des ciments normalisés EN 197-1 depuis l'usine intégrée de Massé. Pilier de l'indépendance industrielle et des grands chantiers nationaux.
            </p>

            {/* Norm Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-[#4ADE80] text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
                <ShieldCheck size={16} weight="bold" />
                <span>Norme EN 197-1</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
                <CheckCircle size={16} weight="bold" />
                <span>ISO 9001:2015</span>
              </span>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={SITE_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0131FD] text-white flex items-center justify-center transition"
                aria-label="LinkedIn NOCIBÉ"
              >
                <FaLinkedinIn size={14} />
              </a>
              <a
                href={SITE_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0131FD] text-white flex items-center justify-center transition"
                aria-label="Facebook NOCIBÉ"
              >
                <FaFacebookF size={14} />
              </a>
            </div>
          </StaggerItem>

          {/* Col 2: Ciments & Solutions (3 cols) */}
          <StaggerItem className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-sans border-l-2 border-[#0131FD] pl-2.5">
              Ciments & Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#00CCFF] transition flex items-center gap-2 group text-left"
                >
                  <IconCementBag size={16} className="text-slate-400 group-hover:text-[#00CCFF]" />
                  <span>Notre gamme de ciments</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('specs')}
                  className="hover:text-[#00CCFF] transition flex items-center gap-2 group text-left"
                >
                  <IconCementBag size={16} className="text-[#00CCFF]" />
                  <span className="font-semibold text-white">Spécifications techniques</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('fabrication')}
                  className="hover:text-[#00CCFF] transition flex items-center gap-2 group text-left"
                >
                  <IconCementBag size={16} className="text-slate-400 group-hover:text-[#00CCFF]" />
                  <span>Procédé de fabrication (1450°C)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('panier')}
                  className="hover:text-[#00CCFF] transition flex items-center gap-2 text-slate-300 text-xs pt-1"
                >
                  <span>Consulter mon panier de commande</span>
                  <ArrowUpRight size={12} />
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="btn-primary px-4 py-2 text-xs font-bold w-full sm:w-auto"
                >
                  Demande de devis B2B
                </button>
              </li>
            </ul>
          </StaggerItem>

          {/* Col 3: L'Entreprise & Engagement (2 cols) */}
          <StaggerItem className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-sans border-l-2 border-[#0131FD] pl-2.5">
              L'Entreprise
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('history')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Notre histoire
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('team')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Notre équipe & Valeurs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('realisations')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Nos réalisations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('objectifs-2030')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Objectifs 2030 & RSE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('securite-qualite')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Sécurité & Qualité
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('careers')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Carrières & Recrutement
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('news')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Actualités & Presse
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('outlets')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Réseau de distribution
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#00CCFF] transition"
                >
                  Nous contacter
                </button>
              </li>
            </ul>
          </StaggerItem>

          {/* Col 4: Siège & Usine (3 cols) */}
          <StaggerItem className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-sans border-l-2 border-[#0131FD] pl-2.5">
              Siège & Usine
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} weight="fill" className="text-[#0131FD] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={LOCATIONS.masse.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00CCFF] block font-medium transition"
                  >
                    {LOCATIONS.masse.name}
                  </a>
                  <span className="text-slate-400">{LOCATIONS.masse.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} weight="fill" className="text-[#00CCFF] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={LOCATIONS.cotonou.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00CCFF] block font-medium transition"
                  >
                    {LOCATIONS.cotonou.name}
                  </a>
                  <span className="text-slate-400">{LOCATIONS.cotonou.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone size={16} weight="fill" className="text-slate-400 shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.phoneMain.replace(/\s+/g, '')}`}
                  className="hover:text-white font-bold text-white transition"
                >
                  {SITE_CONFIG.phoneMain}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <EnvelopeSimple size={16} weight="bold" className="text-slate-400 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-white transition"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Bottom Bar: Copyright, Mentions légales */}
        <Reveal
          variant="fadeIn"
          delay={0.2}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4"
        >
          <p>
            &copy; {new Date().getFullYear()} NOCIBÉ (Nouvelle Cimenterie du Bénin). Tous droits réservés.
          </p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => onNavigate('legal')}
              className="hover:text-slate-200 transition"
            >
              Mentions Légales
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-200 transition"
            >
              Politique de Confidentialité
            </button>
            <span>&bull;</span>
            <span className="text-slate-400">Ciments certifiés EN 197-1</span>
            <span>&bull;</span>
            <span className="text-[#00CCFF] font-medium text-[11px]">
              Excellence industrielle béninoise
            </span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
