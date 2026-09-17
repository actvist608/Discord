import React, { useState, useEffect } from 'react';
import { Server, Channel, User, DirectMessageConversation } from '../types';
import { Search, Hash, Volume2, Users, Compass, X } from 'lucide-react';

interface QuickSwitcherModalProps {
  servers: Server[];
  users: Record<string, User>;
  dms: DirectMessageConversation[];
  onClose: () => void;
  onNavigateChannel: (serverId: string, channelId: string) => void;
  onNavigateDM: (dmId: string) => void;
  onNavigateServer: (serverId: string) => void;
}

export const QuickSwitcherModal: React.FC<QuickSwitcherModalProps> = ({
  servers,
  users,
  dms,
  onClose,
  onNavigateChannel,
  onNavigateDM,
  onNavigateServer,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Aggregate searchable items
  interface SearchItem {
    id: string;
    type: 'channel' | 'voice' | 'dm' | 'server';
    title: string;
    subtitle: string;
    action: () => void;
  }

  const items: SearchItem[] = [];

  // Add Channels
  servers.forEach((srv) => {
    srv.categories.forEach((cat) => {
      cat.channels.forEach((ch) => {
        items.push({
          id: `ch_${ch.id}`,
          type: ch.type === 'voice' ? 'voice' : 'channel',
          title: ch.name,
          subtitle: `${srv.name} — ${cat.name}`,
          action: () => {
            onNavigateChannel(srv.id, ch.id);
            onClose();
          },
        });
      });
    });
  });

  // Add DMs
  dms.forEach((dm) => {
    const user = users[dm.recipientId];
    if (user) {
      items.push({
        id: `dm_${dm.id}`,
        type: 'dm',
        title: user.displayName,
        subtitle: `@${user.username} — Message privé`,
        action: () => {
          onNavigateDM(dm.id);
          onClose();
        },
      });
    }
  });

  // Add Servers
  servers.forEach((srv) => {
    items.push({
      id: `srv_${srv.id}`,
      type: 'server',
      title: srv.name,
      subtitle: 'Serveur Discord',
      action: () => {
        onNavigateServer(srv.id);
        onClose();
      },
    });
  });

  const filtered = query
    ? items.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : items.slice(0, 10);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div
      id="discord-quick-switcher-backdrop"
      className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="discord-quick-switcher"
        className="w-full max-w-xl bg-[#2b2d31] rounded-xl overflow-hidden shadow-2xl border border-[#35373c] select-none animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 bg-[#1e1f22] border-b border-[#35373c] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#949ba4]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Où souhaitez-vous aller ? (#salons, @amis, serveurs)"
            className="w-full bg-transparent text-white text-base placeholder:text-[#949ba4] focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-[#949ba4] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#949ba4]">
              Aucun résultat trouvé pour "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-left transition-colors ${
                    isSelected ? 'bg-[#35373c] text-white' : 'text-[#dbdee1] hover:bg-[#35373c]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.type === 'channel' ? (
                      <Hash className="w-5 h-5 text-[#949ba4]" />
                    ) : item.type === 'voice' ? (
                      <Volume2 className="w-5 h-5 text-[#23a55a]" />
                    ) : item.type === 'dm' ? (
                      <Users className="w-5 h-5 text-[#5865f2]" />
                    ) : (
                      <Compass className="w-5 h-5 text-[#f0b232]" />
                    )}

                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate">{item.title}</span>
                      <span className="text-xs text-[#949ba4] truncate">{item.subtitle}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#949ba4] uppercase font-mono tracking-wider">
                    {item.type}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-[#1e1f22] px-4 py-2 flex items-center justify-between text-[11px] text-[#949ba4] border-t border-[#35373c]">
          <span>
            Naviguer avec <kbd className="font-mono bg-[#2b2d31] px-1 rounded">↑</kbd>{' '}
            <kbd className="font-mono bg-[#2b2d31] px-1 rounded">↓</kbd>, valider avec{' '}
            <kbd className="font-mono bg-[#2b2d31] px-1 rounded">Entrée</kbd>
          </span>
          <span>
            Quitter avec <kbd className="font-mono bg-[#2b2d31] px-1 rounded">Échap</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
