import React, { useState } from 'react';
import { Server, User, Role } from '../types';
import {
  Shield,
  Trash2,
  Plus,
  Check,
  X,
  Users,
  Sliders,
  AlertTriangle,
  Copy,
  UserCheck,
} from 'lucide-react';

interface ServerSettingsModalProps {
  server: Server;
  currentUser: User;
  users: Record<string, User>;
  onClose: () => void;
  onUpdateServer: (serverId: string, name: string, icon?: string) => void;
  onDeleteServer: (serverId: string) => void;
  onCreateRole: (serverId: string, role: { name: string; color: string; hoist: boolean }) => void;
  onDeleteRole: (serverId: string, roleId: string) => void;
  onToggleRole: (serverId: string, targetUserId: string, roleId: string) => void;
}

const PRESET_COLORS = [
  '#E74C3C', // Red
  '#E67E22', // Orange
  '#F1C40F', // Yellow
  '#2ECC71', // Green
  '#1ABC9C', // Teal
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#E91E63', // Pink
  '#5865F2', // Discord Blurple
  '#95A5A6', // Gray
];

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({
  server,
  currentUser,
  users,
  onClose,
  onUpdateServer,
  onDeleteServer,
  onCreateRole,
  onDeleteRole,
  onToggleRole,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'members' | 'danger'>('roles');

  // Overview state
  const [serverName, setServerName] = useState(server.name);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // New role state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#3498DB');
  const [newRoleHoist, setNewRoleHoist] = useState(true);

  // Danger state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const memberRolesMap = server.memberRoles || {};

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/#invite=${server.inviteCode || server.id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    onUpdateServer(server.id, serverName.trim());
  };

  const handleCreateNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    onCreateRole(server.id, {
      name: newRoleName.trim(),
      color: newRoleColor,
      hoist: newRoleHoist,
    });
    setNewRoleName('');
  };

  const handleDeleteServerConfirm = () => {
    if (deleteConfirmText.trim().toLowerCase() === server.name.trim().toLowerCase()) {
      onDeleteServer(server.id);
      onClose();
    }
  };

  return (
    <div
      id="modal-server-settings-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="modal-server-settings"
        className="w-full max-w-4xl h-[85vh] bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#232428] flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-60 bg-[#2b2d31] p-4 flex flex-col justify-between border-r border-[#1f2023] shrink-0">
          <div className="space-y-4">
            <div className="px-2">
              <span className="text-xs font-bold text-[#949ba4] uppercase tracking-wider block">
                Paramètres de
              </span>
              <h2 className="text-sm font-bold text-white truncate">{server.name}</h2>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('roles')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'roles'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
                }`}
              >
                <Shield className="w-4 h-4 text-[#5865f2]" />
                <span>Rôles du serveur</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'members'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
                }`}
              >
                <Users className="w-4 h-4 text-[#23a55a]" />
                <span>Membres & Rôles</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#35373c] text-white'
                    : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#f0b232]" />
                <span>Vue d'ensemble</span>
              </button>
            </nav>

            <div className="h-[1px] bg-[#35373c] my-2" />

            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'danger'
                  ? 'bg-[#da373c] text-white'
                  : 'text-[#da373c] hover:bg-[#da373c]/15'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer le serveur</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#35373c]">
            <button
              onClick={onClose}
              className="w-full py-1.5 px-3 bg-[#1e1f22] hover:bg-[#35373c] text-[#dbdee1] hover:text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Fermer (Échap)</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-[#313338]">
          {/* TAB: ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-white">Rôles dédiés au serveur</h3>
                <p className="text-xs text-[#949ba4] mt-0.5">
                  Créez des rôles personnalisés pour ce serveur et attribuez-les vous ou aux autres membres.
                </p>
              </div>

              {/* Create Role Form */}
              <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#35373c] space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#5865f2]" />
                  <span>Créer un nouveau rôle</span>
                </h4>

                <form onSubmit={handleCreateNewRole} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#b5bac1] mb-1">
                      Nom du rôle
                    </label>
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Ex: 👑 Chef, 🛡️ Modérateur, ⭐ VIP, 🎮 Gamer"
                      className="w-full h-9 bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-3 border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none placeholder:text-[#949ba4]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#b5bac1] mb-1.5">
                      Couleur du rôle
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewRoleColor(c)}
                          className={`w-6 h-6 rounded-full transition-transform ${
                            newRoleColor.toLowerCase() === c.toLowerCase()
                              ? 'ring-2 ring-white scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className="flex items-center gap-2 ml-2">
                        <input
                          type="color"
                          value={newRoleColor}
                          onChange={(e) => setNewRoleColor(e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                          title="Couleur personnalisée"
                        />
                        <span className="text-xs text-[#949ba4] font-mono">{newRoleColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="role-hoist-check"
                      checked={newRoleHoist}
                      onChange={(e) => setNewRoleHoist(e.target.checked)}
                      className="rounded border-[#35373c] text-[#5865f2] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="role-hoist-check" className="text-xs text-[#dbdee1] cursor-pointer">
                      Afficher les membres ayant ce rôle séparément dans la liste des membres
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!newRoleName.trim()}
                      className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter ce rôle au serveur</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Roles List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-[#949ba4] tracking-wider">
                  Rôles actuels sur ce serveur ({server.roles.length})
                </h4>

                <div className="divide-y divide-[#35373c]/50 bg-[#2b2d31] rounded-xl border border-[#35373c] overflow-hidden">
                  {server.roles.map((role) => {
                    // Count members with this role
                    const memberCount = (Object.values(memberRolesMap) as string[][]).filter((rIds) =>
                      rIds && Array.isArray(rIds) && rIds.includes(role.id)
                    ).length;

                    const isCurrentUserAssigned = (memberRolesMap[currentUser.id] || []).includes(
                      role.id
                    );

                    return (
                      <div
                        key={role.id}
                        className="p-3.5 flex items-center justify-between hover:bg-[#35373c]/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: role.color }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="font-bold text-sm"
                                style={{ color: role.color }}
                              >
                                {role.name}
                              </span>
                              {role.hoist && (
                                <span className="bg-[#1e1f22] text-[#949ba4] text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                  Séparé
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#949ba4]">
                              {memberCount} membre{memberCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Self-give or remove button */}
                          <button
                            onClick={() => onToggleRole(server.id, currentUser.id, role.id)}
                            className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                              isCurrentUserAssigned
                                ? 'bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/40 hover:bg-[#f23f43]/20 hover:text-[#f23f43] hover:border-[#f23f43]/40'
                                : 'bg-[#1e1f22] text-[#dbdee1] hover:bg-[#5865f2] hover:text-white border border-[#35373c]'
                            }`}
                            title={isCurrentUserAssigned ? 'Retirer ce rôle de mon compte' : 'Me give ce rôle'}
                          >
                            {isCurrentUserAssigned ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Attribué à moi</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Me donner ce rôle</span>
                              </>
                            )}
                          </button>

                          {/* Delete role button */}
                          <button
                            onClick={() => onDeleteRole(server.id, role.id)}
                            title="Supprimer ce rôle"
                            className="p-1.5 text-[#949ba4] hover:text-[#f23f43] rounded hover:bg-[#1e1f22] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-white">Gestion des rôles des membres</h3>
                <p className="text-xs text-[#949ba4] mt-0.5">
                  Attribuez ou retirez des rôles à n'importe quel membre du serveur en un clic.
                </p>
              </div>

              <div className="space-y-2">
                {server.members.map((userId) => {
                  const user = users[userId];
                  if (!user) return null;
                  const assignedRoleIds = memberRolesMap[userId] || [];
                  const isMe = user.id === currentUser.id;

                  return (
                    <div
                      key={user.id}
                      className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-sm truncate">
                              {user.displayName}
                            </span>
                            {isMe && (
                              <span className="text-[10px] bg-[#5865f2] text-white px-1.5 py-0.2 rounded font-semibold">
                                Vous
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#949ba4] block truncate">
                            @{user.username}
                          </span>
                        </div>
                      </div>

                      {/* Roles Badges & Toggles */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {server.roles.map((role) => {
                          const hasRole = assignedRoleIds.includes(role.id);
                          return (
                            <button
                              key={role.id}
                              onClick={() => onToggleRole(server.id, user.id, role.id)}
                              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                                hasRole
                                  ? 'bg-[#1e1f22] text-white shadow-xs'
                                  : 'bg-[#1e1f22]/40 text-[#949ba4] border-transparent opacity-60 hover:opacity-100'
                              }`}
                              style={{
                                borderColor: hasRole ? role.color : 'transparent',
                              }}
                              title={hasRole ? `Retirer ${role.name}` : `Attribuer ${role.name}`}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: role.color }}
                              />
                              <span>{role.name}</span>
                              {hasRole && <Check className="w-3 h-3 text-[#23a55a]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-white">Vue d'ensemble du serveur</h3>
                <p className="text-xs text-[#949ba4] mt-0.5">
                  Configurez le nom et consultez les détails de votre serveur.
                </p>
              </div>

              <form onSubmit={handleSaveOverview} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#b5bac1] mb-1">
                    Nom du serveur
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full h-10 bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-3 border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#b5bac1] mb-1">
                    Code d'invitation du serveur
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={server.inviteCode || server.id}
                      className="flex-1 h-9 bg-[#1e1f22] text-xs text-[#dbdee1] rounded px-3 border border-[#35373c] font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyInvite}
                      className="px-3 h-9 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {copiedInvite ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le lien</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#23a55a] hover:bg-[#1f8b4d] text-white text-xs font-semibold rounded transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: DANGER / DELETE SERVER */}
          {activeTab === 'danger' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-[#da373c] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Zone de danger : Supprimer le serveur</span>
                </h3>
                <p className="text-xs text-[#949ba4] mt-1">
                  La suppression d'un serveur est irréversible. Tous les salons, messages et données de ce serveur seront définitivement supprimés pour tous les utilisateurs.
                </p>
              </div>

              <div className="bg-[#da373c]/10 border border-[#da373c]/40 rounded-xl p-4 space-y-4">
                <p className="text-xs text-[#dbdee1]">
                  Pour confirmer la suppression définitive du serveur{' '}
                  <strong className="text-white font-bold underline">{server.name}</strong>, veuillez taper son nom exact ci-dessous :
                </p>

                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={`Tapez "${server.name}"`}
                  className="w-full h-10 bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-3 border border-[#da373c]/40 focus:border-[#da373c] focus:outline-none"
                />

                <button
                  type="button"
                  disabled={deleteConfirmText.trim().toLowerCase() !== server.name.trim().toLowerCase()}
                  onClick={handleDeleteServerConfirm}
                  className="w-full py-2.5 bg-[#da373c] hover:bg-[#b82a2e] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer définitivement ce serveur</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
