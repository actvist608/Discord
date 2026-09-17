import React, { useState } from 'react';
import { Server, User } from '../types';
import { UserPlus, Copy, Check, X, Search, CheckCircle } from 'lucide-react';

interface ServerInviteModalProps {
  server: Server;
  currentUser: User;
  users: Record<string, User>;
  onClose: () => void;
  onInviteUser: (serverId: string, targetUserId: string) => void;
}

export const ServerInviteModal: React.FC<ServerInviteModalProps> = ({
  server,
  currentUser,
  users,
  onClose,
  onInviteUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<Record<string, boolean>>({});

  const inviteLink = `${window.location.origin}/#invite=${server.inviteCode || server.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (userId: string) => {
    onInviteUser(server.id, userId);
    setInvitedUsers((prev) => ({ ...prev, [userId]: true }));
  };

  const serverMemberIds = new Set(server.members);
  const allUsersList: User[] = (Object.values(users) as User[]).filter((u) => u.id !== currentUser.id);

  const filteredUsers = allUsersList.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="modal-server-invite-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="modal-server-invite"
        className="w-full max-w-md bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#232428] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#2b2d31] border-b border-[#1f2023] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserPlus className="w-5 h-5 text-[#5865f2]" />
            <span>Inviter des amis sur {server.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#949ba4] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des amis à inviter"
              className="w-full h-9 bg-[#1e1f22] text-xs text-[#dbdee1] rounded px-3 pr-8 placeholder:text-[#949ba4] focus:outline-none border border-[#1e1f22] focus:border-[#5865f2]"
            />
            <Search className="w-4 h-4 text-[#949ba4] absolute right-2.5 top-2.5" />
          </div>

          {/* Users list */}
          <div className="max-h-52 overflow-y-auto space-y-1.5 scrollbar-thin">
            {filteredUsers.length === 0 ? (
              <p className="text-xs text-[#949ba4] text-center py-4">Aucun utilisateur trouvé.</p>
            ) : (
              filteredUsers.map((user) => {
                const isAlreadyMember = serverMemberIds.has(user.id);
                const isJustInvited = invitedUsers[user.id];

                return (
                  <div
                    key={user.id}
                    className="p-2 rounded-lg bg-[#2b2d31] hover:bg-[#35373c] flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">
                          {user.displayName}
                        </span>
                        <span className="text-[10px] text-[#949ba4] block truncate">
                          @{user.username}
                        </span>
                      </div>
                    </div>

                    {isAlreadyMember ? (
                      <span className="text-[11px] text-[#23a55a] font-semibold flex items-center gap-1 bg-[#23a55a]/10 px-2 py-1 rounded">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Membre</span>
                      </span>
                    ) : isJustInvited ? (
                      <span className="text-[11px] text-[#5865f2] font-semibold flex items-center gap-1 bg-[#5865f2]/10 px-2 py-1 rounded">
                        <Check className="w-3.5 h-3.5" />
                        <span>Invité !</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInvite(user.id)}
                        className="px-3 py-1 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors"
                      >
                        Inviter
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Direct link box */}
          <div className="pt-2 border-t border-[#35373c] space-y-1.5">
            <span className="text-[11px] font-bold uppercase text-[#b5bac1]">
              OU ENVOYEZ LE LIEN D'INVITATION DU SERVEUR
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 h-9 bg-[#1e1f22] text-xs text-[#dbdee1] rounded px-3 border border-[#35373c] font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 h-9 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
