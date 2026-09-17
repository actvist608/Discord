import React, { useState, useRef, useEffect } from 'react';
import { User, UserStatus } from '../types';
import { Mic, MicOff, Headphones, Settings, Check, Smile, LogOut } from 'lucide-react';
import { playMuteSound, playUnmuteSound } from '../utils/audio';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';

interface UserControlBarProps {
  currentUser: User;
  onUpdateStatus: (status: UserStatus, customStatus?: string) => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
}

export const UserControlBar: React.FC<UserControlBarProps> = ({
  currentUser,
  onUpdateStatus,
  onOpenSettings,
  onLogout,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [customStatusInput, setCustomStatusInput] = useState(currentUser.customStatus || '');
  const [isEditingCustomStatus, setIsEditingCustomStatus] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
        setIsEditingCustomStatus(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusMenu]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeafened) {
      setIsDeafened(false);
    }
    const next = !isMuted;
    setIsMuted(next);
    if (next) {
      playMuteSound();
    } else {
      playUnmuteSound();
    }
  };

  const handleToggleDeafen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isDeafened;
    setIsDeafened(next);
    if (next) {
      setIsMuted(true);
      playMuteSound();
    } else {
      playUnmuteSound();
    }
  };

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

  const statusOptions: { label: string; status: UserStatus; desc: string; color: string }[] = [
    { label: 'En ligne', status: 'online', desc: 'Prêt à discuter et vocaliser', color: 'bg-[#23a55a]' },
    { label: 'Absent', status: 'idle', desc: 'Loin du clavier temporairement', color: 'bg-[#f0b232]' },
    { label: 'Ne pas déranger', status: 'dnd', desc: 'Désactive toutes les notifications sonores', color: 'bg-[#f23f43]' },
    { label: 'Invisible', status: 'offline', desc: 'Apparaître hors ligne pour tout le monde', color: 'bg-[#80848e]' },
  ];

  return (
    <div
      id="discord-user-bar"
      className="relative h-[52px] bg-[#232428] px-2 flex items-center justify-between select-none z-20 shrink-0 border-t border-[#1e1f22]"
    >
      {/* User Info Clickable Area */}
      <button
        id="btn-user-presence-toggle"
        onClick={() => setShowStatusMenu(!showStatusMenu)}
        className="flex items-center gap-2 p-1 -ml-1 rounded-md hover:bg-[#35373c] transition-colors group text-left max-w-[130px] truncate"
      >
        <AvatarWithDecoration
          avatarUrl={currentUser.avatar}
          decoration={currentUser.avatarDecoration}
          status={currentUser.status}
          size="sm"
          showStatus={true}
        />

        <div className="flex flex-col min-w-0 leading-tight">
          <UserDisplayName
            name={currentUser.displayName}
            font={currentUser.nameFont}
            color={currentUser.nameColor}
            className="text-sm text-[#dbdee1] group-hover:text-white truncate"
          />
          <span className="text-[11px] text-[#949ba4] truncate">
            {currentUser.customStatus || `@${currentUser.username}`}
          </span>
        </div>
      </button>

      {/* Mic, Headphones, Settings buttons */}
      <div className="flex items-center">
        <button
          id="btn-toggle-mic"
          onClick={handleToggleMute}
          title={isMuted ? 'Réactiver le micro' : 'Couper le micro'}
          className={`p-1.5 rounded-md transition-colors ${
            isMuted
              ? 'text-[#f23f43] hover:bg-[#35373c]'
              : 'text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          id="btn-toggle-deafen"
          onClick={handleToggleDeafen}
          title={isDeafened ? 'Réactiver le son' : 'Mettre en sourdine'}
          className={`p-1.5 rounded-md transition-colors ${
            isDeafened
              ? 'text-[#f23f43] hover:bg-[#35373c]'
              : 'text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]'
          }`}
        >
          {isDeafened ? <Headphones className="w-5 h-5 text-[#f23f43] line-through opacity-90" /> : <Headphones className="w-5 h-5" />}
        </button>

        <button
          id="btn-open-user-settings"
          onClick={onOpenSettings}
          title="Paramètres utilisateur"
          className="p-1.5 rounded-md text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Discord Authentic Status Popover */}
      {showStatusMenu && (
        <div
          ref={menuRef}
          className="absolute bottom-[58px] left-2 w-[280px] bg-[#111214] border border-[#232428] rounded-lg p-1.5 shadow-2xl z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Custom Status preview / edit */}
          <div className="p-2 border-b border-[#232428] mb-1">
            {isEditingCustomStatus ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateStatus(currentUser.status, customStatusInput);
                  setIsEditingCustomStatus(false);
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-1.5 bg-[#1e1f22] px-2 py-1.5 rounded border border-[#2b2d31]">
                  <Smile className="w-4 h-4 text-[#949ba4] shrink-0" />
                  <input
                    type="text"
                    value={customStatusInput}
                    onChange={(e) => setCustomStatusInput(e.target.value)}
                    placeholder="Qu'avez-vous en tête ?"
                    className="w-full bg-transparent text-xs text-[#dbdee1] focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomStatus(false)}
                    className="px-2 py-1 text-[#949ba4] hover:underline"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded font-medium"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingCustomStatus(true)}
                className="w-full flex items-center justify-between text-left p-1 rounded hover:bg-[#232428] text-xs text-[#b5bac1] group"
              >
                <span className="truncate">
                  {currentUser.customStatus ? (
                    <span className="text-[#dbdee1]">{currentUser.customStatus}</span>
                  ) : (
                    'Définir un statut personnalisé'
                  )}
                </span>
                <span className="text-[10px] text-[#5865f2] opacity-0 group-hover:opacity-100">Modifier</span>
              </button>
            )}
          </div>

          {/* Status radio choices */}
          <div className="flex flex-col gap-0.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.status}
                onClick={() => {
                  onUpdateStatus(opt.status, currentUser.customStatus);
                  setShowStatusMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-[#232428] transition-colors text-left group ${
                  currentUser.status === opt.status ? 'bg-[#232428]/60' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${opt.color}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-[#dbdee1] group-hover:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#949ba4] leading-tight">{opt.desc}</span>
                  </div>
                </div>
                {currentUser.status === opt.status && (
                  <Check className="w-4 h-4 text-[#5865f2] shrink-0" />
                )}
              </button>
            ))}
          </div>

          {onLogout && (
            <>
              <div className="h-[1px] bg-[#232428] my-1" />
              <button
                type="button"
                onClick={() => {
                  setShowStatusMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-[#f23f43]/20 text-[#f23f43] transition-colors text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Se déconnecter</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
