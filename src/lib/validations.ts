import { z } from 'zod';

export const contactFormSchema = z.object({
  nom: z
    .string()
    .min(2, 'Le nom doit comporter au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .email('Adresse email invalide (ex: contact@entreprise.bj)'),
  sujet: z
    .string()
    .min(2, "Veuillez préciser l'objet de votre message"),
  message: z
    .string()
    .min(5, 'Votre message doit comporter au moins 5 caractères')
    .max(5000, 'Message trop long (maximum 5 000 caractères)'),
  honeypot: z.string().max(0, 'Tentative de spam détectée').optional().or(z.literal('')),
});

export const quoteFormSchema = z.object({
  nom: z
    .string()
    .min(2, 'Le nom ou raison sociale est obligatoire'),
  telephone: z
    .string()
    .min(8, 'Numéro de téléphone requis (ex: +229 01 47 81 67 78)'),
  email: z
    .string()
    .email('Adresse email invalide')
    .optional()
    .or(z.literal('')),
  produit: z
    .string()
    .min(1, 'Sélectionnez un type de ciment'),
  quantite: z
    .string()
    .min(1, 'Précisez la quantité estimée'),
  unite: z
    .string()
    .default('sacs'),
  departement: z
    .string()
    .min(2, 'Sélectionnez un département au Bénin'),
  commune: z
    .string()
    .min(2, 'Précisez la commune ou ville de livraison'),
  siteDetails: z
    .string()
    .optional(),
  message: z
    .string()
    .optional(),
  honeypot: z.string().max(0, 'Tentative de spam détectée').optional().or(z.literal('')),
});

export const authRegisterSchema = z.object({
  nom: z.string().min(2, 'Le nom est obligatoire'),
  prenom: z.string().min(2, 'Le prénom est obligatoire'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().min(8, 'Numéro de téléphone obligatoire (format Bénin)'),
  motDePasse: z
    .string()
    .min(10, 'Le mot de passe doit comporter au moins 10 caractères')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis'),
});

export const authLoginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
});

export const orderCheckoutSchema = z.object({
  departement: z.string().min(2, 'Département requis'),
  commune: z.string().min(2, 'Commune requise'),
  adresse: z.string().min(3, 'Adresse ou repère précis de livraison requis'),
  dateLivraison: z.string().optional(),
  note: z.string().optional(),
});

