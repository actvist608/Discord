import React, { useState } from 'react';
import { Server, Channel, User, UserStatus, VoiceState } from '../types';
import {
  Hash,
  Volume2,
  Megaphone,
  ChevronDown,
  ChevronRight,
  Plus,
  PhoneOff,
  Radio,
  Monitor,
  Sparkles,
  UserPlus,
  Settings,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react';
import { UserControlBar } from './UserControlBar';

interface ChannelSidebarProps {
  server: Server;
  selectedChannelId: string;
  onSelectChannel: (channelId: string) => void;
  voiceState: VoiceState;
  onJoinVoice: (channelId: string) => void;
  onDisconnectVoice: () => void;
  onOpenCreateChannel: (categoryId?: string) => void;
  currentUser: User;
  users: Record<string, User>;
  onUpdateStatus: (status: UserStatus, customStatus?: string) => void;
  onOpenSettings: () => void;
  onOpenServerSettings?: () => void;
  onOpenInviteModal?: () => void;
  onDeleteServer?: () => void;
  onLogout?: () => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  server,
  selectedChannelId,
  onSelectChannel,
  voiceState,
  onJoinVoice,
  onDisconnectVoice,
  onOpenCreateChannel,
  currentUser,
  users,
  onUpdateStatus,
  onOpenSettings,
  onOpenServerSettings,
  onOpenInviteModal,
  onDeleteServer,
  onLogout,
}) => {
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'voice':
        return <Volume2 className="w-4 h-4 text-[#949ba4] shrink-0" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-[#949ba4] shrink-0" />;
      case 'text':
      default:
        return <Hash className="w-4 h-4 text-[#949ba4] shrink-0" />;
    }
  };

  return (
    <div
      id="discord-channel-sidebar"
      className="w-[240px] h-full bg-[#2b2d31] flex flex-col justify-between select-none z-20 shrink-0 border-r border-[#1f2023]"
    >
      {/* Server Header Dropdown */}
      <div className="relative">
        <button
          id="btn-server-header-menu"
          onClick={() => setShowServerMenu(!showServerMenu)}
          className={`w-full h-12 px-4 flex items-center justify-between font-bold text-sm text-[#dbdee1] border-b border-[#1f2023] shadow-sm transition-colors ${
            showServerMenu ? 'bg-[#35373c]' : 'hover:bg-[#35373c]/60'
          }`}
        >
          <span className="truncate">{server.name}</span>
          <ChevronDown
            className={`w-4 h-4 text-[#dbdee1] transition-transform duration-200 ${
              showServerMenu ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Server Context Menu */}
        {showServerMenu && (
          <div className="absolute top-[52px] left-2 right-2 bg-[#111214] border border-[#232428] rounded-md p-1.5 shadow-2xl z-50 text-xs text-[#949ba4] animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setShowServerMenu(false);
                if (onOpenInviteModal) {
                  onOpenInviteModal();
                } else {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/#invite=${server.inviteCode || server.id}`
                  );
                  alert('Lien d\'invitation copié dans le presse-papiers !');
                }
              }}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#5865f2] hover:text-white transition-colors text-left text-[#5865f2]"
            >
              <span>Inviter des personnes</span>
              <UserPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setShowServerMenu(false);
                onOpenCreateChannel();
              }}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#5865f2] hover:text-white transition-colors text-left"
            >
              <span>Créer un salon</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setShowServerMenu(false);
                if (onOpenServerSettings) {
                  onOpenServerSettings();
                } else {
                  onOpenSettings();
                }
              }}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors text-left"
            >
              <span>Paramètres du serveur</span>
              <Settings className="w-3.5 h-3.5" />
            </button>
            <div className="h-[1px] bg-[#232428] my-1" />
            <button
              onClick={() => {
                setShowServerMenu(false);
                if (onDeleteServer) {
                  if (
                    confirm(
                      `Êtes-vous sûr de vouloir supprimer définitivement le serveur "${server.name}" ? Tous les salons et messages seront supprimés.`
                    )
                  ) {
                    onDeleteServer();
                  }
                }
              }}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#da373c] hover:text-white text-[#da373c] transition-colors text-left"
            >
              <span>Supprimer le serveur</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Channel Categories and Channels */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
        {server.categories.map((category) => {
          const isCollapsed = collapsedCategories[category.id];

          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <div className="flex items-center justify-between px-1 text-[#949ba4] group/cat">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase hover:text-[#dbdee1] transition-colors w-full text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  )}
                  <span className="truncate">{category.name}</span>
                </button>
                <button
                  onClick={() => onOpenCreateChannel(category.id)}
                  title="Créer un salon"
                  className="opacity-0 group-hover/cat:opacity-100 p-0.5 rounded hover:text-[#dbdee1] hover:bg-[#35373c] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Channels List */}
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {category.channels.map((chan) => {
                    const isSelected = selectedChannelId === chan.id;
                    const isVoice = chan.type === 'voice';
                    const isCurrentVoice = voiceState.channelId === chan.id;

                    return (
                      <div key={chan.id} className="flex flex-col">
                        <button
                          id={`btn-channel-${chan.id}`}
                          onClick={() => {
                            if (isVoice) {
                              onJoinVoice(chan.id);
                            } else {
                              onSelectChannel(chan.id);
                            }
                          }}
                          className={`w-full h-[34px] px-2 rounded-md flex items-center justify-between transition-colors text-left group ${
                            isSelected && !isVoice
                              ? 'bg-[#35373c] text-white font-medium'
                              : isCurrentVoice
                              ? 'bg-[#23a55a]/15 text-[#23a55a] font-medium'
                              : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {getChannelIcon(chan.type)}
                            <span className="text-sm truncate">{chan.name}</span>
                          </div>

                          {/* Voice participant counter */}
                          {isVoice && chan.userLimit && (
                            <span className="text-[10px] bg-[#1e1f22] text-[#949ba4] px-1.5 py-0.5 rounded-full">
                              {(chan.connectedUsers?.length || 0) + (isCurrentVoice ? 1 : 0)}/{chan.userLimit}
                            </span>
                          )}
                        </button>

                        {/* Connected Users inside Voice Channel */}
                        {isVoice && (
                          <div className="pl-6 pr-2 py-1 space-y-1">
                            {/* Current user if in this room */}
                            {isCurrentVoice && (
                              <div className="flex items-center gap-2 py-0.5 text-xs text-[#dbdee1] font-medium animate-in fade-in duration-150">
                                <div className="relative">
                                  <img
                                    src={currentUser.avatar}
                                    alt={currentUser.displayName}
                                    className="w-5 h-5 rounded-full object-cover ring-2 ring-[#23a55a]"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span className="truncate">{currentUser.displayName}</span>
                              </div>
                            )}

                            {/* Other connected users */}
                            {chan.connectedUsers?.map((uid) => {
                              const u = users[uid];
                              if (!u) return null;
                              return (
                                <div
                                  key={uid}
                                  className="flex items-center gap-2 py-0.5 text-xs text-[#949ba4] hover:text-[#dbdee1] transition-colors"
                                >
                                  <img
                                    src={u.avatar}
                                    alt={u.displayName}
                                    className="w-5 h-5 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="truncate">{u.displayName}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice Connected Overlay Status Bar */}
      {voiceState.isConnected && (
        <div
          id="discord-voice-connected-bar"
          className="h-[52px] bg-[#232428] px-3 flex items-center justify-between border-t border-[#1e1f22] select-none"
        >
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-[#23a55a] text-xs font-bold leading-tight">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Voix connectée</span>
            </div>
            <span className="text-[11px] text-[#949ba4] truncate">
              RTC connecté / {server.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-disconnect-voice"
              onClick={onDisconnectVoice}
              title="Déconnexion"
              className="p-1.5 rounded text-[#b5bac1] hover:text-[#f23f43] hover:bg-[#35373c] transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* User Controls Bar */}
      <UserControlBar
        currentUser={currentUser}
        onUpdateStatus={onUpdateStatus}
        onOpenSettings={onOpenSettings}
        onLogout={onLogout}
      />
    </div>
  );
};
