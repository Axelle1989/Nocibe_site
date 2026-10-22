import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Users,
  Briefcase,
  MagnifyingGlass,
  FileText,
  DownloadSimple,
  CheckCircle,
  XCircle,
  Clock,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  GraduationCap,
  Sparkle,
  Eye,
  FileArrowDown,
} from '@phosphor-icons/react';

interface Application {
  id: string;
  reference: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  typeCandidature: string;
  secteurInteret: string;
  niveauEtudes: string;
  diplome: string;
  anneesExperience: string;
  disponibilite: string;
  pretentionsSalariales: string | null;
  messageMotivation: string | null;
  statut: string;
  noteInterne: string | null;
  createdAt: string;
  jobOffer?: {
    titre: string;
    reference: string;
  } | null;
  files?: Array<{
    id: string;
    typeFichier: string;
    nomFichier: string;
    taille: number;
  }>;
}

export const AdminCareersPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterType, setFilterType] = useState('Tous');
  const [search, setSearch] = useState('');

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatut, setNewStatut] = useState('');
  const [newNote, setNewNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.careers.getAdminApplications({
        statut: filterStatut,
        type: filterType,
        search: search || undefined,
      });
      if (res?.applications) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Erreur chargement candidatures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatut, filterType, search]);

  const handleOpenDetail = (app: Application) => {
    setSelectedApp(app);
    setNewStatut(app.statut);
    setNewNote(app.noteInterne || '');
    setFeedback(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    setFeedback(null);
    try {
      await api.careers.updateApplicationStatus(selectedApp.id, newStatut, newNote);
      setFeedback('Statut et note mis à jour avec succès.');
      setSelectedApp((prev) => (prev ? { ...prev, statut: newStatut, noteInterne: newNote } : null));
      fetchApplications();
    } catch (err: any) {
      setFeedback(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCsv = () => {
    if (applications.length === 0) return;
    const headers = [
      'Référence',
      'Date',
      'Statut',
      'Type',
      'Prénom',
      'Nom',
      'Email',
      'Téléphone',
      'Ville',
      'Pays',
      'Diplôme',
      'Expérience',
      'Offre ciblée',
    ];
    const rows = applications.map((a) => [
      `"${a.reference}"`,
      `"${new Date(a.createdAt).toLocaleDateString('fr-FR')}"`,
      `"${a.statut}"`,
      `"${a.typeCandidature}"`,
      `"${a.prenom}"`,
      `"${a.nom}"`,
      `"${a.email}"`,
      `"${a.telephone}"`,
      `"${a.ville || ''}"`,
      `"${a.pays || ''}"`,
      `"${a.diplome || ''}"`,
      `"${a.anneesExperience || ''}"`,
      `"${a.jobOffer?.titre || 'Spontanée'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nocibe_candidatures_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadge = (statut: string) => {
    switch (statut) {
      case 'NOUVELLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Nouvelle</span>;
      case 'EN_REVUE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">En revue RH</span>;
      case 'ENTRETIEN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Entretien planifié</span>;
      case 'RETENUE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Retenue / Embauche</span>;
      case 'REJETEE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Non retenue</span>;
      case 'VIVIER':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Vivier Talents</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300">{statut}</span>;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-white flex items-center gap-2">
            <Users size={26} className="text-[#0131FD]" />
            <span>Gestion des Candidatures & Recrutement</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Examen des dossiers, consultation des CV sécurisés et suivi du vivier de talents NOCIBÉ.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/20"
        >
          <DownloadSimple size={16} weight="bold" />
          <span>Exporter en CSV</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-[#0B1F3A] rounded-2xl p-4 border border-[#1E3A5F] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par candidat, email..."
            className="w-full pl-9 pr-3 py-2 bg-[#07142A] border border-[#1E3A5F] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0131FD]"
          />
        </div>

        <div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="w-full px-3 py-2 bg-[#07142A] border border-[#1E3A5F] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0131FD]"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="NOUVELLE">Nouvelle</option>
            <option value="EN_REVUE">En revue</option>
            <option value="ENTRETIEN">Entretien</option>
            <option value="RETENUE">Retenue</option>
            <option value="REJETEE">Rejetée</option>
            <option value="VIVIER">Vivier</option>
          </select>
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 bg-[#07142A] border border-[#1E3A5F] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0131FD]"
          >
            <option value="Tous">Tous les types</option>
            <option value="OFFRE">Offre d'emploi</option>
            <option value="STAGE_ACADEMIQUE">Stage académique</option>
            <option value="STAGE_PROFESSIONNEL">Stage professionnel</option>
            <option value="SPONTANEE">Candidature spontanée</option>
          </select>
        </div>
      </div>

      {/* Tableau des candidatures */}
      <div className="bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Chargement des candidatures...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Users size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">Aucune candidature trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#07142A] border-b border-[#1E3A5F] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Réf & Date</th>
                  <th className="p-3.5">Candidat</th>
                  <th className="p-3.5">Type & Poste</th>
                  <th className="p-3.5">Diplôme</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.03] transition">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-white">{app.reference}</div>
                      <div className="text-[10px] text-slate-400">{new Date(app.createdAt).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{app.prenom} {app.nom}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">
                        {app.jobOffer ? app.jobOffer.titre : app.typeCandidature}
                      </div>
                      <div className="text-[10px] text-slate-400">{app.secteurInteret}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200">{app.diplome}</div>
                      <div className="text-[10px] text-slate-400">{app.anneesExperience}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {statusBadge(app.statut)}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(app)}
                        className="px-3 py-1.5 rounded-lg bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition inline-flex items-center gap-1.5"
                      >
                        <Eye size={14} />
                        <span>Examiner</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détail Candidature */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-2xl bg-[#0B1F3A] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 text-white space-y-6 my-8">
            <div className="flex justify-between items-start border-b border-[#1E3A5F] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#00CCFF]">
                  Candidature #{selectedApp.reference}
                </span>
                <h2 className="text-xl font-serif font-black text-white mt-1">
                  {selectedApp.prenom} {selectedApp.nom}
                </h2>
                <p className="text-xs text-slate-300">
                  {selectedApp.jobOffer ? `Poste : ${selectedApp.jobOffer.titre}` : `Type : ${selectedApp.typeCandidature}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Infos Contact & Parcours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#07142A] p-4 rounded-2xl border border-[#1E3A5F]">
              <div>
                <span className="text-slate-400">Email :</span>
                <div className="font-semibold">{selectedApp.email}</div>
              </div>
              <div>
                <span className="text-slate-400">Téléphone :</span>
                <div className="font-semibold">{selectedApp.telephone}</div>
              </div>
              <div>
                <span className="text-slate-400">Localisation :</span>
                <div className="font-semibold">{selectedApp.ville}, {selectedApp.pays}</div>
              </div>
              <div>
                <span className="text-slate-400">Diplôme :</span>
                <div className="font-semibold">{selectedApp.diplome} ({selectedApp.niveauEtudes})</div>
              </div>
              <div>
                <span className="text-slate-400">Expérience :</span>
                <div className="font-semibold">{selectedApp.anneesExperience}</div>
              </div>
              <div>
                <span className="text-slate-400">Disponibilité :</span>
                <div className="font-semibold">{selectedApp.disponibilite}</div>
              </div>
            </div>

            {/* Message de motivation */}
            {selectedApp.messageMotivation && (
              <div className="text-xs bg-[#07142A] p-4 rounded-2xl border border-[#1E3A5F]">
                <span className="text-slate-400 block mb-1">Message du candidat :</span>
                <p className="text-slate-200 leading-relaxed italic">{selectedApp.messageMotivation}</p>
              </div>
            )}

            {/* Fichiers joints (CV sécurisé) */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Documents déposés</h4>
              <div className="space-y-2">
                {selectedApp.files && selectedApp.files.length > 0 ? (
                  selectedApp.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#07142A] border border-[#1E3A5F]"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <FileText size={18} className="text-[#0131FD]" />
                        <span className="font-semibold">{file.nomFichier}</span>
                        <span className="text-slate-400">({(file.taille / 1024).toFixed(0)} Ko)</span>
                      </div>
                      <a
                        href={`/api/careers/admin/applications/${selectedApp.id}/cv`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FileArrowDown size={14} />
                        <span>Télécharger</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-[#07142A] border border-[#1E3A5F] text-xs text-slate-400">
                    Aucun fichier lié à cette candidature de démonstration.
                  </div>
                )}
              </div>
            </div>

            {/* Modification du statut & Note interne */}
            <div className="border-t border-[#1E3A5F] pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Évaluation RH</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Modifier le statut :</label>
                  <select
                    value={newStatut}
                    onChange={(e) => setNewStatut(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07142A] border border-[#1E3A5F] rounded-xl text-xs text-white"
                  >
                    <option value="NOUVELLE">Nouvelle</option>
                    <option value="EN_REVUE">En revue</option>
                    <option value="ENTRETIEN">Entretien</option>
                    <option value="RETENUE">Retenue / Embauche</option>
                    <option value="REJETEE">Rejetée</option>
                    <option value="VIVIER">Vivier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Note interne RH :</label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ex: Profil intéressant pour le PFE de juillet..."
                    className="w-full px-3 py-2 bg-[#07142A] border border-[#1E3A5F] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {feedback && (
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs">
                  {feedback}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  {updating ? 'Enregistrement...' : 'Enregistrer la décision RH'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersPage;

