import React, { useState } from 'react';
import { User, FriendRelation, UserStatus } from '../types';
import {
  Users,
  MessageSquare,
  Phone,
  MoreVertical,
  Search,
  Sparkles,
  Gamepad2,
  Music,
  UserPlus,
  Check,
  X,
} from 'lucide-react';

interface FriendsViewProps {
  friends: FriendRelation[];
  users: Record<string, User>;
  onStartDM: (userId: string) => void;
  onSelectUser: (user: User) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  friends,
  users,
  onStartDM,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'blocked' | 'add'>('online');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const getStatusDot = (status: UserStatus) => {
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

  const friendUsers = friends
    .map((f) => ({ relation: f, user: users[f.userId] }))
    .filter((item) => item.user !== undefined);

  const onlineFriends = friendUsers.filter(
    (f) => f.relation.status === 'friend' && f.user.status !== 'offline'
  );

  const allFriends = friendUsers.filter((f) => f.relation.status === 'friend');
  const pendingFriends = friendUsers.filter((f) => f.relation.status.startsWith('pending'));
  const blockedFriends = friendUsers.filter((f) => f.relation.status === 'blocked');

  const displayedList =
    activeTab === 'online'
      ? onlineFriends
      : activeTab === 'all'
      ? allFriends
      : activeTab === 'pending'
      ? pendingFriends
      : blockedFriends;

  const filteredList = displayedList.filter(
    (f) =>
      f.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setAddFriendInput('');
    }, 2500);
  };

  return (
    <div
      id="discord-friends-view"
      className="flex-1 bg-[#313338] flex flex-col h-full overflow-hidden select-none"
    >
      {/* Top Header Bar */}
      <header className="h-12 px-4 bg-[#313338] flex items-center justify-between border-b border-[#1f2023] shrink-0 z-10">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-2 text-white font-bold text-base pr-2 border-r border-[#4e5058]">
            <Users className="w-5 h-5 text-[#949ba4]" />
            <span>Amis</span>
          </div>

          <button
            onClick={() => setActiveTab('online')}
            className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
              activeTab === 'online'
                ? 'bg-[#35373c] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            En ligne
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#35373c] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            Tous
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-2 py-1 rounded text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-[#35373c] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            <span>En attente</span>
            {pendingFriends.length > 0 && (
              <span className="bg-[#f23f43] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingFriends.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
              activeTab === 'blocked'
                ? 'bg-[#35373c] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            Bloqués
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-2.5 py-1 rounded text-sm font-bold transition-all ${
              activeTab === 'add'
                ? 'bg-[#23a55a] text-white'
                : 'text-[#23a55a] hover:underline'
            }`}
          >
            Ajouter un ami
          </button>
        </div>
      </header>

      {/* Main Content Area: Friends list on left, "Active Now" on right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column: List or Add Friend */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-thin">
          {activeTab === 'add' ? (
            <div className="max-w-xl">
              <h2 className="text-white font-bold text-base uppercase tracking-wider mb-2">
                AJOUTER UN AMI
              </h2>
              <p className="text-xs text-[#949ba4] mb-4">
                Vous pouvez ajouter des amis avec leur nom d'utilisateur Discord.
              </p>

              <form onSubmit={handleAddFriend} className="relative mb-4">
                <input
                  type="text"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  placeholder="Vous pouvez ajouter des amis avec leur nom d'utilisateur Discord."
                  className="w-full h-12 bg-[#1e1f22] text-[#dbdee1] rounded-lg px-4 pr-36 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!addFriendInput.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors"
                >
                  Envoyer une demande
                </button>
              </form>

              {addSuccess && (
                <div className="p-3 bg-[#23a55a]/20 border border-[#23a55a] text-[#23a55a] rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <Check className="w-4 h-4" />
                  <span>Demande d'ami envoyée avec succès !</span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Search Friends bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-3 pr-8 placeholder:text-[#949ba4] focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#949ba4] absolute right-3 top-2.5" />
              </div>

              {/* Title Section */}
              <h3 className="text-xs font-bold text-[#949ba4] uppercase tracking-wider mb-3">
                {activeTab === 'online'
                  ? `EN LIGNE — ${filteredList.length}`
                  : activeTab === 'all'
                  ? `TOUS LES AMIS — ${filteredList.length}`
                  : `EN ATTENTE — ${filteredList.length}`}
              </h3>

              {/* Friends List rows */}
              <div className="divide-y divide-[#35373c]/40">
                {filteredList.map(({ user }) => (
                  <div
                    key={user.id}
                    className="py-2.5 px-2 rounded-lg hover:bg-[#35373c]/50 flex items-center justify-between group transition-colors"
                  >
                    <button
                      onClick={() => onSelectUser(user)}
                      className="flex items-center gap-3 min-w-0 text-left"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#313338] ${getStatusDot(
                            user.status
                          )}`}
                        />
                      </div>

                      <div className="flex flex-col min-w-0 leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-semibold text-sm truncate group-hover:underline">
                            {user.displayName}
                          </span>
                          <span className="text-xs text-[#949ba4] opacity-0 group-hover:opacity-100 transition-opacity">
                            @{user.username}
                          </span>
                        </div>
                        <span className="text-xs text-[#949ba4] truncate">
                          {user.activity ? (
                            <span className="text-[#dbdee1]">
                              {user.activity.type === 'listening' ? 'Écoute ' : 'Joue à '}
                              <strong>{user.activity.name}</strong>
                            </span>
                          ) : (
                            user.customStatus || user.status
                          )}
                        </span>
                      </div>
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartDM(user.id)}
                        title="Envoyer un message"
                        className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#111214] text-[#b5bac1] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Lancement de l'appel avec ${user.displayName}...`)}
                        title="Appel vocal"
                        className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#111214] text-[#b5bac1] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right column: "En ce moment" (Active Now) */}
        <div className="w-80 border-l border-[#1f2023] p-4 hidden xl:flex flex-col select-none">
          <h2 className="text-white font-bold text-lg mb-4">En ce moment</h2>

          {(Object.values(users) as User[]).filter((u) => u.status !== 'offline').length > 1 ? (
            <div className="space-y-4">
              {(Object.values(users) as User[])
                .filter((u) => u.status !== 'offline')
                .slice(0, 5)
                .map((activeUser) => (
                  <div
                    key={activeUser.id}
                    onClick={() => onSelectUser(activeUser)}
                    className="p-3 bg-[#2b2d31] border border-[#35373c] rounded-xl hover:bg-[#35373c]/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{activeUser.displayName}</p>
                        <p className="text-[10px] text-[#23a55a] font-semibold flex items-center gap-1 truncate">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>{activeUser.customStatus || 'Connecté en direct'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1e1f22] p-2.5 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#5865f2]/20 flex items-center justify-center text-[#5865f2] shrink-0 font-bold text-xs">
                        LIVE
                      </div>
                      <div className="flex flex-col text-xs min-w-0">
                        <span className="font-bold text-white truncate">{activeUser.displayName}</span>
                        <span className="text-[#949ba4] truncate">@{activeUser.username}</span>
                        <span className="text-[10px] text-[#23a55a] font-mono mt-0.5">En ligne sur l'app</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-[#949ba4]">
              <div className="w-16 h-16 rounded-full bg-[#2b2d31] flex items-center justify-center text-[#949ba4] mb-3">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">C'est bien calme ici...</h3>
              <p className="text-xs mb-4">
                Dès qu'un ami ou collègue ouvre le même lien dans son navigateur, vous le verrez apparaître en direct ici !
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Lien de l\'application copié dans le presse-papier ! Envoyez-le à un ami pour discuter en direct.');
                }}
                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors shadow"
              >
                Copier le lien d'invitation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
