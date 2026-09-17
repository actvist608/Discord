import React, { useState } from 'react';
import { DirectMessageConversation, User, UserStatus } from '../types';
import { Users, Sparkles, ShoppingBag, Plus, X, Search } from 'lucide-react';
import { UserControlBar } from './UserControlBar';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';

interface HomeSidebarProps {
  conversations: DirectMessageConversation[];
  users: Record<string, User>;
  selectedDMId: string | null;
  onSelectDM: (dmId: string) => void;
  onSelectFriendsTab: () => void;
  isFriendsActive: boolean;
  onOpenQuickSwitcher: () => void;
  currentUser: User;
  onUpdateStatus: (status: UserStatus, customStatus?: string) => void;
  onOpenSettings: () => void;
  pendingFriendsCount: number;
  onStartNewDM: () => void;
  onLogout?: () => void;
}

export const HomeSidebar: React.FC<HomeSidebarProps> = ({
  conversations,
  users,
  selectedDMId,
  onSelectDM,
  onSelectFriendsTab,
  isFriendsActive,
  onOpenQuickSwitcher,
  currentUser,
  onUpdateStatus,
  onOpenSettings,
  pendingFriendsCount,
  onStartNewDM,
  onLogout,
}) => {
  const [activeSpecialTab, setActiveSpecialTab] = useState<'friends' | 'nitro' | 'shop'>('friends');

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
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

  return (
    <div
      id="discord-home-sidebar"
      className="w-[240px] h-full bg-[#2b2d31] flex flex-col justify-between select-none z-20 shrink-0 border-r border-[#1f2023]"
    >
      {/* Top Search bar button */}
      <div className="h-12 px-2.5 flex items-center border-b border-[#1f2023] shadow-sm">
        <button
          id="btn-quick-switcher-trigger"
          onClick={onOpenQuickSwitcher}
          className="w-full h-7 px-2 bg-[#1e1f22] text-[#949ba4] text-xs rounded flex items-center justify-between hover:text-[#dbdee1] transition-colors group"
        >
          <span className="truncate">Trouver ou lancer...</span>
          <kbd className="text-[10px] bg-[#2b2d31] text-[#949ba4] px-1 rounded border border-[#35373c] font-mono group-hover:border-[#4e5058]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Main Navigation & DM list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin">
        {/* Friends tab */}
        <button
          id="btn-tab-friends"
          onClick={() => {
            setActiveSpecialTab('friends');
            onSelectFriendsTab();
          }}
          className={`w-full h-[42px] px-3 rounded-md flex items-center justify-between transition-colors ${
            isFriendsActive && activeSpecialTab === 'friends'
              ? 'bg-[#35373c] text-white'
              : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5" />
            <span className="font-semibold text-sm">Amis</span>
          </div>
          {pendingFriendsCount > 0 && (
            <span className="bg-[#f23f43] text-white text-[11px] font-bold px-1.5 py-0.2 min-w-[16px] rounded-full text-center">
              {pendingFriendsCount}
            </span>
          )}
        </button>

        {/* Nitro tab */}
        <button
          id="btn-tab-nitro"
          onClick={() => {
            setActiveSpecialTab('nitro');
            onSelectFriendsTab();
          }}
          className={`w-full h-[42px] px-3 rounded-md flex items-center gap-3 transition-colors ${
            !isFriendsActive && activeSpecialTab === 'nitro'
              ? 'bg-[#35373c] text-white'
              : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#f47b67]" />
          <span className="font-semibold text-sm">Nitro</span>
        </button>

        {/* Shop tab */}
        <button
          id="btn-tab-shop"
          onClick={() => {
            setActiveSpecialTab('shop');
            onSelectFriendsTab();
          }}
          className={`w-full h-[42px] px-3 rounded-md flex items-center gap-3 transition-colors ${
            !isFriendsActive && activeSpecialTab === 'shop'
              ? 'bg-[#35373c] text-white'
              : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-semibold text-sm">Boutique</span>
        </button>

        {/* DIRECT MESSAGES Header */}
        <div className="pt-4 pb-1 px-2 flex items-center justify-between text-[#949ba4] group">
          <span className="text-[11px] font-bold tracking-wider uppercase">Messages Privés</span>
          <button
            id="btn-create-dm"
            onClick={onStartNewDM}
            title="Créer un message privé"
            className="hover:text-[#dbdee1] transition-colors p-0.5 rounded hover:bg-[#35373c]"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* DM List */}
        <div className="space-y-0.5">
          {conversations.map((dm) => {
            const recipient = users[dm.recipientId];
            if (!recipient) return null;
            const isSelected = selectedDMId === dm.id && !isFriendsActive;

            return (
              <div
                key={dm.id}
                className="group relative flex items-center"
              >
                <button
                  id={`btn-dm-${dm.id}`}
                  onClick={() => onSelectDM(dm.id)}
                  className={`w-full h-[42px] px-2 rounded-md flex items-center gap-2.5 transition-colors text-left ${
                    isSelected
                      ? 'bg-[#35373c] text-white'
                      : 'text-[#949ba4] hover:bg-[#35373c]/60 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <AvatarWithDecoration
                      avatarUrl={recipient.avatar}
                      decoration={recipient.avatarDecoration}
                      status={recipient.status}
                      size="sm"
                      showStatus={true}
                    />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1 leading-tight">
                    <UserDisplayName
                      name={recipient.displayName}
                      font={recipient.nameFont}
                      color={recipient.nameColor}
                      className="text-sm truncate group-hover:text-white"
                    />
                    <span className="text-[11px] text-[#949ba4] truncate">
                      {recipient.activity ? (
                        <span>
                          {recipient.activity.type === 'listening' ? 'Écoute ' : 'Joue à '}
                          <span className="text-[#dbdee1]">{recipient.activity.name}</span>
                        </span>
                      ) : recipient.customStatus ? (
                        <span>{recipient.customStatus}</span>
                      ) : (
                        <span>@{recipient.username}</span>
                      )}
                    </span>
                  </div>

                  {dm.unreadCount && dm.unreadCount > 0 ? (
                    <span className="bg-[#f23f43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {dm.unreadCount}
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Controls Footer */}
      <UserControlBar
        currentUser={currentUser}
        onUpdateStatus={onUpdateStatus}
        onOpenSettings={onOpenSettings}
        onLogout={onLogout}
      />
    </div>
  );
};
