import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientPortal } from '../../hooks/useClientPortal';
import {
  Bell,
  CheckCircle,
  Truck,
  Sparkle,
  Info,
  Check,
  ArrowRight,
} from '@phosphor-icons/react';

export const ClientNotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useClientPortal();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => (filter === 'unread' ? !n.lu : true));
  const unreadCount = notifications.filter(n => !n.lu).length;

  const getIcon = (type?: string) => {
    switch (type) {
      case 'commande':
        return <Truck size={20} className="text-[#0B1F3A]" weight="duotone" />;
      case 'produit':
        return <Sparkle size={20} className="text-[#0131FD]" weight="duotone" />;
      default:
        return <Info size={20} className="text-blue-600" weight="duotone" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#0B1F3A]">
            Mes Notifications <span className="italic text-[#0131FD]">Logistiques</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mises à jour des expéditions de ciment, messages d'usine et nouveautés catalogue
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-slate-600 hover:text-[#0B1F3A] bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check size={14} />
              <span>Tout marquer comme lu</span>
            </button>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-slate-500'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'unread' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-slate-500'
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
          <Bell size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#0B1F3A]">Aucune notification pour le moment</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Les notifications d'acheminement de ciment et les validations de chargement apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.lu
                  ? 'bg-white border-slate-200/80'
                  : 'bg-blue-50/40 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.lu ? 'bg-slate-100' : 'bg-white border border-blue-200 shadow-xs'
                  }`}
                >
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      {notif.titre}
                    </h3>
                    {!notif.lu && (
                      <span className="w-2 h-2 rounded-full bg-[#0131FD]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    {new Date(notif.created_at).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {!notif.lu && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-[11px] font-bold text-slate-500 hover:text-[#0B1F3A] flex items-center gap-1"
                    title="Marquer comme lu"
                  >
                    <CheckCircle size={14} />
                    <span>Marquer lu</span>
                  </button>
                )}

                {notif.lien && (
                  <Link
                    to={notif.lien}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1F3A] hover:text-[#0131FD] transition-colors"
                  >
                    <span>Consulter</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

