import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Factory, Users, Zap, Award } from "lucide-react";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { CountUp } from "../ui/CountUp";
import type { Page, Language } from "../layout/Header";

interface HeroProps {
  onNavigate?: (page: Page) => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, language }) => {
  const isFr = language === "fr";

  const stats = [
    {
      numeric: 1.5,
      decimals: 1,
      suffix: "M",
      unit: isFr ? "Tonnes / an" : "Tons / year",
      label: isFr ? "Capacité de production" : "Production Capacity",
      icon: Factory,
    },
    {
      numeric: 500,
      decimals: 0,
      suffix: "+",
      unit: isFr ? "Emplois directs" : "Direct jobs",
      label: isFr ? "Collaborateurs au Bénin" : "Employees in Benin",
      icon: Users,
    },
    {
      numeric: 100,
      decimals: 0,
      suffix: "+",
      unit: "Milliards FCFA",
      label: isFr ? "Investissement industriel" : "Industrial Investment",
      icon: Zap,
    },
    {
      numeric: 15,
      decimals: 0,
      suffix: "+",
      unit: isFr ? "Années" : "Years",
      label: isFr ? "Excellence & Solidité" : "Excellence & Strength",
      icon: Award,
    },
  ];

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#061B3D]">
      {/* Background Image with Responsive Image */}
      <div className="absolute inset-0 z-0">
        <ResponsiveImage
          desktopSrc="/images/vue-aerienne-usine-hd.jpg"
          mobileSrc="/images/vue-aerienne-usine-hd.jpg"
          alt="Usine de clinker et ciment NOCIBÉ Massè"
          priority
          className="w-full h-full"
          imageClassName="w-full h-full object-cover scale-105 filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Mandated Gradient Overlay: from-[#0A2A5E]/90 to-transparent for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A5E]/95 via-[#0A2A5E]/85 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061B3D] via-transparent to-black/30" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 md:pt-44 pb-16 flex-1 flex items-center">
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E6F0FF] text-xs font-semibold tracking-wider uppercase mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span>
                {isFr ? "Leader de la cimenterie intégrée au Bénin" : "Leader in Integrated Cement in Benin"}
              </span>
            </div>

            {/* Hero Title in Instrument Serif */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-6">
              {isFr ? (
                <>
                  Bâtir l'avenir avec{" "}
                  <span className="italic font-normal text-[#E6F0FF] underline decoration-[#FF7A00]/60 decoration-wavy decoration-1 underline-offset-8">
                    solidité
                  </span>{" "}
                  & excellence
                </>
              ) : (
                <>
                  Building the future with{" "}
                  <span className="italic font-normal text-[#E6F0FF] underline decoration-[#FF7A00]/60 decoration-wavy decoration-1 underline-offset-8">
                    strength
                  </span>{" "}
                  & excellence
                </>
              )}
            </h1>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg md:text-xl text-slate-200/90 leading-relaxed max-w-2xl mb-10">
              {isFr
                ? "De l'extraction du calcaire au clinker de Massè, la Nouvelle Cimenterie du Bénin produit des ciments certifiés aux standards internationaux pour vos chantiers d'envergure."
                : "From limestone quarrying to Massè clinker, Nouvelle Cimenterie du Bénin manufactures certified cement meeting international standards for major infrastructure projects."}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <button
                onClick={() => onNavigate?.("sales")}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF7A00] text-white font-bold text-base rounded-xl shadow-lg hover:bg-[#E66E00] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none"
              >
                <span>{isFr ? "Commander du ciment" : "Order Cement"}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => onNavigate?.("products-list")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-xl border border-white/25 backdrop-blur-md transition-all focus:outline-none"
              >
                <span>{isFr ? "Découvrir la gamme" : "Explore Products"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar with CountUp */}
      <div className="relative z-10 w-full bg-[#0A2A5E]/80 backdrop-blur-xl border-t border-white/10 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3.5 md:gap-4 md:border-r last:border-0 border-white/15"
                >
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-[#E6F0FF] shrink-0">
                    <Icon size={22} className="text-[#FF7A00]" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-1">
                      <CountUp
                        end={stat.numeric}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      {stat.unit}
                    </div>
                    <div className="text-[11px] text-slate-400 hidden sm:block">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

