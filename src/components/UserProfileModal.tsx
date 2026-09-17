import React, { useState } from 'react';
import { User, Server } from '../types';
import { Sparkles, Shield, Code, Heart, X, MessageSquare, Plus, Check } from 'lucide-react';
import { ProfileEffectLayer } from './ProfileEffectLayer';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onSendDM?: (userId: string) => void;
  server?: Server;
  onToggleRole?: (serverId: string, userId: string, roleId: string) => void;
  currentUser?: User;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onSendDM,
  server,
  onToggleRole,
  currentUser,
}) => {
  const [quickMessage, setQuickMessage] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const assignedRoleIds = server?.memberRoles?.[user.id] || [];
  const isMe = currentUser?.id === user.id;

  const renderBadge = (badge: string) => {
    switch (badge) {
      case 'nitro':
        return (
          <div
            key={badge}
            title="Abonné Discord Nitro"
            className="w-6 h-6 rounded bg-[#eb459e]/20 flex items-center justify-center text-[#eb459e] border border-[#eb459e]/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
      case 'booster':
        return (
          <div
            key={badge}
            title="Booster de serveur"
            className="w-6 h-6 rounded bg-[#f47b67]/20 flex items-center justify-center text-[#f47b67] border border-[#f47b67]/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
      case 'developer':
        return (
          <div
            key={badge}
            title="Développeur actif"
            className="w-6 h-6 rounded bg-[#5865f2]/20 flex items-center justify-center text-[#5865f2] border border-[#5865f2]/30"
          >
            <Code className="w-3.5 h-3.5" />
          </div>
        );
      case 'hypesquad_bravery':
        return (
          <div
            key={badge}
            title="HypeSquad Bravery"
            className="w-6 h-6 rounded bg-[#9b59b6]/20 flex items-center justify-center text-[#9b59b6] border border-[#9b59b6]/30"
          >
            <Shield className="w-3.5 h-3.5" />
          </div>
        );
      case 'staff':
        return (
          <div
            key={badge}
            title="Personnel Discord"
            className="w-6 h-6 rounded bg-[#5865f2] flex items-center justify-center text-white"
          >
            <Shield className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusDot = () => {
    switch (user.status) {
      case 'online':
        return 'bg-[#23a55a]';
      case 'idle':
        return 'bg-[#f0b232]';
      case 'dnd':
        return 'bg-[#f23f43]';
      case 'offline':
      default:
        return 'bg-[#80848e]';
    }
  };

  // Compute dynamic banner style
  const bannerStyle: React.CSSProperties = {};
  if (user.bannerUrl) {
    bannerStyle.backgroundImage = `url(${user.bannerUrl})`;
    bannerStyle.backgroundSize = 'cover';
    bannerStyle.backgroundPosition = 'center';
  } else if (user.bannerGradient) {
    bannerStyle.background = user.bannerGradient;
  } else {
    bannerStyle.backgroundColor = user.bannerColor || '#5865F2';
  }

  return (
    <div
      id="discord-user-profile-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="discord-user-profile-modal"
        className="w-full max-w-[340px] bg-[#111214] rounded-2xl overflow-hidden shadow-2xl border border-[#232428] relative animate-in zoom-in-95 duration-150 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Profile Effect Overlay (Visible to everyone!) */}
        <ProfileEffectLayer effect={user.profileEffect} />

        {/* Banner Color & Image & Gradient */}
        <div
          className="h-28 w-full relative"
          style={bannerStyle}
        >
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-4 pb-4 relative z-20">
          {/* Avatar and Badges Row */}
          <div className="flex items-end justify-between -mt-12 mb-3">
            <AvatarWithDecoration
              avatarUrl={user.avatar}
              decoration={user.avatarDecoration}
              status={user.status}
              size="xl"
            />

            {/* Badges Container */}
            <div className="bg-[#232428]/90 backdrop-blur-xs p-1.5 rounded-lg flex items-center gap-1 border border-[#2b2d31]">
              {user.badges.map((b) => renderBadge(b))}
            </div>
          </div>

          {/* User Card Content */}
          <div className="bg-[#232428] rounded-xl p-3.5 border border-[#2b2d31] space-y-3">
            {/* Display Name & Username & Pronouns */}
            <div className="border-b border-[#35373c] pb-2.5">
              <UserDisplayName
                name={user.displayName}
                font={user.nameFont}
                color={user.nameColor}
                className="text-white font-bold text-lg leading-tight block"
              />
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-[#949ba4]">
                  @{user.username}
                  {user.discriminator ? `#${user.discriminator}` : ''}
                </p>
                {user.pronouns && (
                  <span className="text-[10px] bg-[#1e1f22] text-[#dbdee1] px-1.5 py-0.2 rounded font-medium">
                    {user.pronouns}
                  </span>
                )}
              </div>
              {user.customStatus && (
                <p className="text-xs text-[#dbdee1] mt-1.5 font-medium">{user.customStatus}</p>
              )}
            </div>

            {/* Activity info (if any) */}
            {user.activity && (
              <div className="border-b border-[#35373c] pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4] block mb-1">
                  {user.activity.type === 'listening' ? 'Écoute' : 'Joue à'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#1e1f22] rounded text-[#23a55a]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{user.activity.name}</p>
                    {user.activity.details && (
                      <p className="text-[11px] text-[#949ba4]">{user.activity.details}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* About Me / Bio */}
            {user.bio && (
              <div className="border-b border-[#35373c] pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4] block mb-1">
                  À propos de moi
                </span>
                <p className="text-xs text-[#dbdee1] whitespace-pre-line leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Member Since dates */}
            <div className="border-b border-[#35373c] pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4] block mb-1">
                Membre Discord depuis
              </span>
              <p className="text-xs text-[#dbdee1]">{user.joinedDiscord}</p>
            </div>

            {/* Server Roles Section */}
            {server && (
              <div className="border-b border-[#35373c] pb-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4]">
                    Rôles sur ce serveur
                  </span>
                  {onToggleRole && (
                    <button
                      type="button"
                      onClick={() => setShowRoleSelector(!showRoleSelector)}
                      className="text-[10px] text-[#5865f2] hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isMe ? 'Me give un rôle' : 'Modifier les rôles'}</span>
                    </button>
                  )}
                </div>

                {/* Role tags list */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {server.roles
                    .filter((r) => assignedRoleIds.includes(r.id))
                    .map((r) => (
                      <span
                        key={r.id}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border"
                        style={{
                          backgroundColor: `${r.color}15`,
                          borderColor: `${r.color}50`,
                          color: r.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: r.color }}
                        />
                        <span>{r.name}</span>
                        {onToggleRole && (
                          <button
                            onClick={() => onToggleRole(server.id, user.id, r.id)}
                            className="hover:opacity-75 p-0.5"
                            title="Retirer ce rôle"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </span>
                    ))}

                  {assignedRoleIds.length === 0 && (
                    <span className="text-xs text-[#949ba4] italic">Aucun rôle attribué</span>
                  )}
                </div>

                {/* Role Selector Popover */}
                {showRoleSelector && onToggleRole && (
                  <div className="mt-2.5 p-2 bg-[#1e1f22] rounded-lg border border-[#35373c] space-y-1">
                    <span className="text-[10px] text-[#949ba4] block font-semibold px-1">
                      Sélectionnez pour attribuer ou retirer :
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-0.5 scrollbar-thin">
                      {server.roles.map((r) => {
                        const hasRole = assignedRoleIds.includes(r.id);
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => onToggleRole(server.id, user.id, r.id)}
                            className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-[#35373c] text-xs font-semibold text-left transition-colors"
                            style={{ color: r.color }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: r.color }}
                              />
                              <span>{r.name}</span>
                            </div>
                            {hasRole && <Check className="w-3.5 h-3.5 text-[#23a55a]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Direct Message Button & Quick DM form */}
            {onSendDM && !isMe && (
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSendDM(user.id);
                    onClose();
                  }}
                  className="w-full h-8 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer un message privé</span>
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (quickMessage.trim()) {
                      onSendDM(user.id);
                      onClose();
                    }
                  }}
                >
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      placeholder={`Message rapide à @${user.displayName}`}
                      className="w-full bg-[#1e1f22] text-xs text-[#dbdee1] rounded-lg px-3 py-2 border border-[#35373c] focus:outline-none focus:border-[#5865f2] placeholder:text-[#949ba4]"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 text-[#949ba4] hover:text-[#5865f2] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
