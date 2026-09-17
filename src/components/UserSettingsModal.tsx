import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import {
  X,
  User as UserIcon,
  Palette,
  Mic,
  Keyboard,
  LogOut,
  Sparkles,
  Volume2,
  Check,
  Upload,
  Image as ImageIcon,
  Type,
  Wand2,
  Flame,
  Film,
  Layers,
  Search,
} from 'lucide-react';
import { playMessageSound } from '../utils/audio';
import { uploadImageFile } from '../utils/imageUtils';
import {
  NAME_FONTS,
  BANNER_GRADIENTS,
  BANNER_PRESETS,
  AVATAR_PRESETS,
  PROFILE_EFFECTS,
  AVATAR_DECORATIONS,
  PRESET_NAME_COLORS,
  CATALOG_CATEGORIES,
  CatalogCategory,
  getFontFamily,
} from '../utils/profileCustomization';
import { ProfileEffectLayer } from './ProfileEffectLayer';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';

interface UserSettingsModalProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onClose: () => void;
  onLogout: () => void;
}

const PRESET_BANNER_COLORS = [
  '#5865F2', // Blurple
  '#23A55A', // Green
  '#F0B232', // Yellow
  '#F23F43', // Red
  '#EB459E', // Pink
  '#9B59B6', // Purple
  '#111214', // Midnight Black
  '#35373C', // Dark Slate
];

const AVAILABLE_BADGES = [
  { id: 'nitro', name: 'Discord Nitro', icon: '💎', color: '#f47fff' },
  { id: 'booster', name: 'Server Booster', icon: '🚀', color: '#f47fff' },
  { id: 'developer', name: 'Développeur Actif', icon: '🛠️', color: '#5865f2' },
  { id: 'hypesquad_bravery', name: 'HypeSquad Bravery', icon: '🛡️', color: '#9b59b6' },
  { id: 'early_supporter', name: 'Soutien de la première heure', icon: '🏅', color: '#e67e22' },
];

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  currentUser,
  onUpdateUser,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'appearance' | 'keybinds'>('profile');
  const [profileSubTab, setProfileSubTab] = useState<'identity' | 'banner' | 'avatar' | 'effects' | 'typography'>('identity');
  const [catalogCategory, setCatalogCategory] = useState<CatalogCategory>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Editable Profile States
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [pronouns, setPronouns] = useState(currentUser.pronouns || 'il/lui');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarDecoration, setAvatarDecoration] = useState(currentUser.avatarDecoration || 'none');
  const [bannerColor, setBannerColor] = useState(currentUser.bannerColor || '#5865F2');
  const [bannerGradient, setBannerGradient] = useState(currentUser.bannerGradient || '');
  const [bannerUrl, setBannerUrl] = useState(currentUser.bannerUrl || '');
  const [profileEffect, setProfileEffect] = useState(currentUser.profileEffect || 'none');
  const [nameFont, setNameFont] = useState(currentUser.nameFont || 'default');
  const [nameColor, setNameColor] = useState(currentUser.nameColor || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [customStatus, setCustomStatus] = useState(currentUser.customStatus || '');
  const [badges, setBadges] = useState<string[]>(currentUser.badges || ['developer']);

  // Settings states
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Check if there are unsaved changes
  const hasChanges =
    displayName !== currentUser.displayName ||
    username !== currentUser.username ||
    pronouns !== (currentUser.pronouns || 'il/lui') ||
    avatar !== currentUser.avatar ||
    avatarDecoration !== (currentUser.avatarDecoration || 'none') ||
    bannerColor !== (currentUser.bannerColor || '#5865F2') ||
    bannerGradient !== (currentUser.bannerGradient || '') ||
    bannerUrl !== (currentUser.bannerUrl || '') ||
    profileEffect !== (currentUser.profileEffect || 'none') ||
    nameFont !== (currentUser.nameFont || 'default') ||
    nameColor !== (currentUser.nameColor || '') ||
    bio !== (currentUser.bio || '') ||
    customStatus !== (currentUser.customStatus || '') ||
    JSON.stringify(badges) !== JSON.stringify(currentUser.badges || ['developer']);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Mic test simulation animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMicTesting) {
      interval = setInterval(() => {
        setMicVolume(Math.floor(20 + Math.random() * 70));
      }, 100);
    } else {
      setMicVolume(0);
    }
    return () => clearInterval(interval);
  }, [isMicTesting]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const res = await uploadImageFile(file);
      setAvatar(res.url);
    } catch {
      // Fallback to FileReader if offline
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          setAvatar(loadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBanner(true);
      const res = await uploadImageFile(file);
      setBannerUrl(res.url);
      setBannerGradient('');
    } catch {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          setBannerUrl(loadEvent.target.result);
          setBannerGradient('');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleToggleBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((b) => b !== badgeId) : [...prev, badgeId]
    );
  };

  const handleReset = () => {
    setDisplayName(currentUser.displayName);
    setUsername(currentUser.username);
    setPronouns(currentUser.pronouns || 'il/lui');
    setAvatar(currentUser.avatar);
    setAvatarDecoration(currentUser.avatarDecoration || 'none');
    setBannerColor(currentUser.bannerColor || '#5865F2');
    setBannerGradient(currentUser.bannerGradient || '');
    setBannerUrl(currentUser.bannerUrl || '');
    setProfileEffect(currentUser.profileEffect || 'none');
    setNameFont(currentUser.nameFont || 'default');
    setNameColor(currentUser.nameColor || '');
    setBio(currentUser.bio || '');
    setCustomStatus(currentUser.customStatus || '');
    setBadges(currentUser.badges || ['developer']);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updated: Partial<User> = {
      displayName: displayName.trim() || 'Utilisateur',
      username: username.trim().toLowerCase().replace(/\s+/g, '_') || 'user',
      pronouns: pronouns.trim(),
      avatar,
      avatarDecoration,
      bannerColor,
      bannerGradient,
      bannerUrl: bannerUrl.trim(),
      profileEffect,
      nameFont,
      nameColor,
      bio,
      customStatus: customStatus.trim(),
      badges,
    };

    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Compute live banner style
  const liveBannerStyle: React.CSSProperties = {};
  if (bannerUrl) {
    liveBannerStyle.backgroundImage = `url(${bannerUrl})`;
    liveBannerStyle.backgroundSize = 'cover';
    liveBannerStyle.backgroundPosition = 'center';
  } else if (bannerGradient) {
    liveBannerStyle.background = bannerGradient;
  } else {
    liveBannerStyle.backgroundColor = bannerColor;
  }

  return (
    <div
      id="discord-user-settings-overlay"
      className="fixed inset-0 bg-[#313338] z-50 flex select-none overflow-hidden animate-in fade-in duration-150"
    >
      {/* Left Sidebar Menu */}
      <div className="w-[240px] md:w-[280px] bg-[#2b2d31] flex flex-col justify-between py-12 px-6 items-end shrink-0 border-r border-[#1e1f22]">
        <div className="w-48 space-y-1">
          <span className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider px-2 block mb-1">
            PARAMÈTRES UTILISATEUR
          </span>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full px-2.5 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors text-left ${
              activeTab === 'profile'
                ? 'bg-[#35373c] text-white'
                : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#5865f2]" />
            <span>Profil & Personnalisation</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`w-full px-2.5 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors text-left ${
              activeTab === 'voice'
                ? 'bg-[#35373c] text-white'
                : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voix & Vidéo</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full px-2.5 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors text-left ${
              activeTab === 'appearance'
                ? 'bg-[#35373c] text-white'
                : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Apparence</span>
          </button>

          <div className="h-[1px] bg-[#35373c] my-3" />

          <span className="text-[11px] font-bold text-[#949ba4] uppercase tracking-wider px-2 block mb-1">
            PARAMÈTRES DE L'APPLI
          </span>
          <button
            onClick={() => setActiveTab('keybinds')}
            className={`w-full px-2.5 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-colors text-left ${
              activeTab === 'keybinds'
                ? 'bg-[#35373c] text-white'
                : 'text-[#b5bac1] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Raccourcis clavier</span>
          </button>

          <div className="h-[1px] bg-[#35373c] my-3" />

          <button
            onClick={() => {
              if (confirm('Voulez-vous vous déconnecter de votre compte Discord ?')) {
                onClose();
                onLogout();
              }
            }}
            className="w-full px-2.5 py-1.5 rounded text-sm font-semibold flex items-center gap-2 text-[#da373c] hover:bg-[#da373c]/15 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto py-12 px-6 lg:px-12 flex justify-start relative scrollbar-thin">
        {/* ESC Button (Discord style) */}
        <div className="fixed top-12 right-12 z-20 flex flex-col items-center">
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 border-[#b5bac1] hover:border-white text-[#b5bac1] hover:text-white flex items-center justify-center transition-colors group"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold text-[#949ba4] mt-1 tracking-wider uppercase">
            ESC
          </span>
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-5xl pb-28">
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Profil d'utilisateur</h2>
                  <span className="bg-gradient-to-r from-[#eb459e] to-[#5865f2] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Nitro Débloqué
                  </span>
                </div>
                <p className="text-xs text-[#949ba4] mt-1">
                  Personnalisez votre avatar animé (GIF), votre bannière (dégradés, images ou GIFs), votre police de nom et vos effets de profil visibles par tous les membres en direct !
                </p>
              </div>

              {/* Sub-navigation tabs for profile customization */}
              <div className="flex items-center gap-1.5 border-b border-[#35373c] pb-2 mb-6 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setProfileSubTab('identity')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    profileSubTab === 'identity' ? 'bg-[#5865f2] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Identité & Statut</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('typography')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    profileSubTab === 'typography' ? 'bg-[#5865f2] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Police & Couleur du nom</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('avatar')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    profileSubTab === 'avatar' ? 'bg-[#5865f2] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Avatar & GIFs & Cadres</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('banner')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    profileSubTab === 'banner' ? 'bg-[#5865f2] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bannière (Gradients & GIFs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('effects')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    profileSubTab === 'effects' ? 'bg-[#5865f2] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Effets de profil</span>
                </button>
              </div>

              {/* Two Column Layout: Editor on Left, Live Preview Card on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Fields Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* --- SUB-TAB 1: IDENTITÉ --- */}
                  {profileSubTab === 'identity' && (
                    <div className="space-y-5">
                      {/* Display Name Input */}
                      <div>
                        <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          NOM D'AFFICHAGE
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Votre nom"
                          className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                        />
                      </div>

                      {/* Username & Pronouns Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                            NOM D'UTILISATEUR (@)
                          </label>
                          <div className="flex items-center bg-[#1e1f22] rounded px-3 py-2 border border-[#1e1f22] focus-within:border-[#5865f2]">
                            <span className="text-[#949ba4] text-sm mr-1">@</span>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="username"
                              className="w-full bg-transparent text-sm text-[#dbdee1] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                            PRONOMS
                          </label>
                          <input
                            type="text"
                            value={pronouns}
                            onChange={(e) => setPronouns(e.target.value)}
                            placeholder="il/lui, they/them..."
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Custom Status */}
                      <div>
                        <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          STATUT PERSONNALISÉ
                        </label>
                        <input
                          type="text"
                          value={customStatus}
                          onChange={(e) => setCustomStatus(e.target.value)}
                          placeholder="Qu'avez-vous en tête ? (ex: Codeur en chef ⚡)"
                          className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">
                            À PROPOS DE MOI (BIO)
                          </label>
                          <span className="text-[11px] text-[#949ba4]">{190 - bio.length}</span>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={190}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Présentez-vous en quelques mots..."
                          className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none resize-none"
                        />
                      </div>

                      {/* Badges Selection */}
                      <div>
                        <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          BADGES DISCORD
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_BADGES.map((b) => {
                            const isSelected = badges.includes(b.id);
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => handleToggleBadge(b.id)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                  isSelected
                                    ? 'bg-[#5865f2]/20 border-[#5865f2] text-white shadow-sm'
                                    : 'bg-[#1e1f22] border-transparent text-[#949ba4] hover:text-[#dbdee1]'
                                }`}
                              >
                                <span>{b.icon}</span>
                                <span>{b.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#5865f2]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SUB-TAB 2: TYPOGRAPHIE & COULEUR DU NOM --- */}
                  {profileSubTab === 'typography' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                            GRAND CATALOGUE DE POLICES ({NAME_FONTS.length} STYLES)
                          </label>
                          {nameFont !== 'default' && (
                            <button
                              type="button"
                              onClick={() => setNameFont('default')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Par défaut
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#949ba4] mb-3">
                          Sélectionnez une police stylisée qui s'appliquera partout dans le chat, la liste des membres et les salons pour votre nom :
                        </p>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
                          {CATALOG_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCatalogCategory(cat.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 border ${
                                catalogCategory === cat.id
                                  ? 'bg-[#5865f2] border-[#5865f2] text-white shadow-sm'
                                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-[#dbdee1] hover:border-[#35373c]'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Search input */}
                        <div className="relative mb-3">
                          <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                            placeholder="Rechercher une police..."
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded-lg pl-9 pr-3 py-1.5 text-xs border border-[#2b2d31] focus:border-[#5865f2] focus:outline-none"
                          />
                          {catalogSearch && (
                            <button
                              type="button"
                              onClick={() => setCatalogSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#949ba4] hover:text-white"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                          {NAME_FONTS.filter((f) => {
                            const matchCat = catalogCategory === 'all' || f.category === catalogCategory || f.id === 'default';
                            const matchQuery = !catalogSearch || f.name.toLowerCase().includes(catalogSearch.toLowerCase()) || f.preview.toLowerCase().includes(catalogSearch.toLowerCase());
                            return matchCat && matchQuery;
                          }).map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                setNameFont(f.id);
                                playMessageSound();
                              }}
                              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all group ${
                                nameFont === f.id
                                  ? 'bg-[#5865f2]/20 border-[#5865f2] text-white shadow-md ring-1 ring-[#5865f2]'
                                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#b5bac1] hover:border-[#4e5058] hover:bg-[#232428]'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-[11px] text-[#949ba4] font-medium">{f.name}</span>
                                  {f.badge && (
                                    <span className="bg-[#5865f2]/30 text-[#5865f2] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                                      {f.badge}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className="text-base font-bold text-white block truncate tracking-wide"
                                  style={{ fontFamily: f.family !== 'inherit' ? f.family : undefined }}
                                >
                                  {displayName || f.preview}
                                </span>
                              </div>
                              {nameFont === f.id && <Check className="w-4 h-4 text-[#5865f2] shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name Color & Gradients */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                            COULEUR OU DÉGRADÉ DU NOM ({PRESET_NAME_COLORS.length} VARIANTES)
                          </label>
                          {nameColor && (
                            <button
                              type="button"
                              onClick={() => setNameColor('')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Réinitialiser
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#949ba4] mb-3">
                          Appliquez un dégradé éclatant ou une couleur néon vibrante à votre pseudonyme :
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                          {PRESET_NAME_COLORS.map((c) => {
                            const isSelected = nameColor === c.value;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setNameColor(c.value);
                                  playMessageSound();
                                }}
                                className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all ${
                                  isSelected
                                    ? 'bg-[#2b2d31] border-[#5865f2] text-white ring-1 ring-[#5865f2] shadow-sm'
                                    : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-white hover:border-[#35373c]'
                                }`}
                              >
                                <span
                                  className="text-base font-extrabold shrink-0 w-6 text-center"
                                  style={{
                                    backgroundImage: c.value.startsWith('linear-gradient') ? c.value : undefined,
                                    WebkitBackgroundClip: c.value.startsWith('linear-gradient') ? 'text' : undefined,
                                    WebkitTextFillColor: c.value.startsWith('linear-gradient') ? 'transparent' : undefined,
                                    color: !c.value.startsWith('linear-gradient') ? (c.value || '#ffffff') : undefined,
                                  }}
                                >
                                  Aa
                                </span>
                                <span className="text-[11px] truncate flex-1 text-left">{c.name}</span>
                                {isSelected && <Check className="w-3 h-3 text-[#5865f2] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom color picker */}
                        <div className="flex items-center gap-3 bg-[#1e1f22] p-2.5 rounded-lg border border-[#2b2d31]">
                          <span className="text-xs text-[#949ba4]">Couleur personnalisée précise :</span>
                          <input
                            type="color"
                            value={nameColor.startsWith('#') ? nameColor : '#ffffff'}
                            onChange={(e) => setNameColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono text-[#dbdee1]">{nameColor || 'Blanc par défaut'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SUB-TAB 3: AVATAR & GIFS & CADRES --- */}
                  {profileSubTab === 'avatar' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          PHOTO OU GIF DE PROFIL (AVATAR)
                        </label>
                        <div className="flex items-center gap-4 mb-4">
                          <AvatarWithDecoration
                            avatarUrl={avatar}
                            decoration={avatarDecoration}
                            size="xl"
                          />
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isUploadingAvatar}
                                onClick={() => avatarFileInputRef.current?.click()}
                                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{isUploadingAvatar ? 'Envoi en cours...' : 'Uploader une image / GIF'}</span>
                              </button>
                              <input
                                ref={avatarFileInputRef}
                                type="file"
                                accept="image/*,.gif"
                                onChange={handleAvatarUpload}
                                className="hidden"
                              />
                            </div>
                            <span className="text-[11px] text-[#949ba4]">
                              Prend en charge les formats PNG, JPG, WEBP et les GIFs animés !
                            </span>
                          </div>
                        </div>

                        {/* URL input */}
                        <div className="mb-4">
                          <span className="text-[11px] text-[#949ba4] block mb-1">
                            Ou collez directement une URL d'image ou GIF animé :
                          </span>
                          <input
                            type="text"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://media.giphy.com/.../giphy.gif"
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2 text-xs border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                          />
                        </div>

                        {/* Animated GIF Presets */}
                        <span className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          CATALOGUE D'AVATARS & GIFS ANIMÉS
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                          {AVATAR_PRESETS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setAvatar(p.url);
                                playMessageSound();
                              }}
                              className={`relative rounded-xl p-1 bg-[#1e1f22] border transition-all hover:scale-105 flex flex-col items-center gap-1 ${
                                avatar === p.url ? 'border-[#5865f2] ring-1 ring-[#5865f2]' : 'border-[#2b2d31] hover:border-[#4e5058]'
                              }`}
                              title={p.name}
                            >
                              <img
                                src={p.url}
                                alt={p.name}
                                className="w-11 h-11 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[10px] text-[#b5bac1] truncate max-w-full font-medium">
                                {p.name.split(' ')[0]}
                              </span>
                              {p.isGif && (
                                <span className="absolute top-1 right-1 bg-[#eb459e] text-white text-[8px] font-black px-1 rounded-full shadow-xs">
                                  GIF
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Avatar Decoration Frame */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                            DÉCORATIONS & CADRES D'AVATARS ({AVATAR_DECORATIONS.length} CADRES)
                          </label>
                          {avatarDecoration !== 'none' && (
                            <button
                              type="button"
                              onClick={() => setAvatarDecoration('none')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Retirer le cadre
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#949ba4] mb-3">
                          Sélectionnez un contour d'avatar stylisé qui s'anime autour de votre photo pour tous les membres :
                        </p>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
                          {CATALOG_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCatalogCategory(cat.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 border ${
                                catalogCategory === cat.id
                                  ? 'bg-[#5865f2] border-[#5865f2] text-white shadow-sm'
                                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-[#dbdee1] hover:border-[#35373c]'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Search input */}
                        <div className="relative mb-3">
                          <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                            placeholder="Rechercher un cadre d'avatar..."
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded-lg pl-9 pr-3 py-1.5 text-xs border border-[#2b2d31] focus:border-[#5865f2] focus:outline-none"
                          />
                          {catalogSearch && (
                            <button
                              type="button"
                              onClick={() => setCatalogSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#949ba4] hover:text-white"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                          {AVATAR_DECORATIONS.filter((dec) => {
                            const matchCat = catalogCategory === 'all' || dec.category === catalogCategory || dec.id === 'none';
                            const matchQuery = !catalogSearch || dec.name.toLowerCase().includes(catalogSearch.toLowerCase());
                            return matchCat && matchQuery;
                          }).map((dec) => {
                            const isSelected = avatarDecoration === dec.id;
                            return (
                              <button
                                key={dec.id}
                                type="button"
                                onClick={() => {
                                  setAvatarDecoration(dec.id);
                                  playMessageSound();
                                }}
                                className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                                  isSelected
                                    ? 'bg-[#5865f2]/20 border-[#5865f2] text-white shadow-sm ring-1 ring-[#5865f2]'
                                    : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-[#dbdee1] hover:border-[#35373c]'
                                }`}
                              >
                                <span className="text-xl shrink-0 p-1 bg-[#2b2d31] rounded-md">{dec.icon}</span>
                                <div className="truncate flex-1">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-semibold block truncate text-white">{dec.name}</span>
                                  </div>
                                  {dec.badge && (
                                    <span className="text-[9px] text-[#5865f2] font-bold">{dec.badge}</span>
                                  )}
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#5865f2] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SUB-TAB 4: BANNIÈRE (GRADIENTS & GIFS) --- */}
                  {profileSubTab === 'banner' && (
                    <div className="space-y-6">
                      {/* Nitro Gradients */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#eb459e]" />
                            <span>DÉGRADÉS DISCORD NITRO ({BANNER_GRADIENTS.length} DÉGRADÉS)</span>
                          </label>
                          {bannerGradient && (
                            <button
                              type="button"
                              onClick={() => setBannerGradient('')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Réinitialiser
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#949ba4] mb-3">
                          Sélectionnez un dégradé dynamique éclatant pour le fond de votre bannière :
                        </p>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
                          {CATALOG_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCatalogCategory(cat.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 border ${
                                catalogCategory === cat.id
                                  ? 'bg-[#5865f2] border-[#5865f2] text-white shadow-sm'
                                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-[#dbdee1] hover:border-[#35373c]'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 max-h-[260px] overflow-y-auto pr-1">
                          {BANNER_GRADIENTS.filter((g) => {
                            const matchCat = catalogCategory === 'all' || g.category === catalogCategory;
                            const matchQuery = !catalogSearch || g.name.toLowerCase().includes(catalogSearch.toLowerCase());
                            return matchCat && matchQuery;
                          }).map((g) => {
                            const isSelected = bannerGradient === g.gradient && !bannerUrl;
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => {
                                  setBannerGradient(g.gradient);
                                  setBannerUrl('');
                                  playMessageSound();
                                }}
                                style={{ background: g.gradient }}
                                className={`h-12 rounded-lg relative transition-transform hover:scale-[1.03] shadow-sm flex items-end p-1.5 border-2 ${
                                  isSelected ? 'border-white ring-2 ring-[#5865f2]' : 'border-transparent'
                                }`}
                              >
                                <span className="bg-black/60 backdrop-blur-xs text-[10px] text-white font-bold px-1.5 py-0.5 rounded truncate max-w-full">
                                  {g.name}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-[#5865f2] flex items-center justify-center shadow">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* GIF and Image Banners */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                            BANNIÈRE ANIMÉE (IMAGE OU GIF)
                          </label>
                          {bannerUrl && (
                            <button
                              type="button"
                              onClick={() => setBannerUrl('')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Retirer la bannière
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <button
                            type="button"
                            disabled={isUploadingBanner}
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingBanner ? 'Envoi de la bannière...' : 'Uploader une bannière (Image/GIF)'}</span>
                          </button>
                          <input
                            ref={bannerFileInputRef}
                            type="file"
                            accept="image/*,.gif"
                            onChange={handleBannerUpload}
                            className="hidden"
                          />
                        </div>

                        {/* Banner URL */}
                        <div className="mb-4">
                          <span className="text-[11px] text-[#949ba4] block mb-1">
                            Ou entrez une URL de GIF animé ou d'image :
                          </span>
                          <input
                            type="text"
                            value={bannerUrl}
                            onChange={(e) => {
                              setBannerUrl(e.target.value);
                              if (e.target.value) setBannerGradient('');
                            }}
                            placeholder="https://media.giphy.com/.../banner.gif"
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2 text-xs border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                          />
                        </div>

                        {/* Banner Presets */}
                        <span className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          BANNIÈRES GIFS ANIMÉES SUGGÉRÉES DU CATALOGUE
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {BANNER_PRESETS.map((bp) => (
                            <button
                              key={bp.id}
                              type="button"
                              onClick={() => {
                                setBannerUrl(bp.url);
                                setBannerGradient('');
                                playMessageSound();
                              }}
                              className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                                bannerUrl === bp.url ? 'border-[#5865f2] ring-2 ring-white' : 'border-[#2b2d31]'
                              }`}
                            >
                              <img
                                src={bp.url}
                                alt={bp.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                                <span className="text-[10px] font-bold text-white truncate">{bp.name}</span>
                              </div>
                              {bp.isGif && (
                                <span className="absolute top-1 right-1 bg-[#eb459e] text-white text-[8px] font-bold px-1 rounded-full">
                                  GIF
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Solid Colors */}
                      <div>
                        <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                          OU COULEUR UNIE CLASSIQUE
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {PRESET_BANNER_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                setBannerColor(color);
                                setBannerGradient('');
                                setBannerUrl('');
                                playMessageSound();
                              }}
                              style={{ backgroundColor: color }}
                              className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                                bannerColor.toLowerCase() === color.toLowerCase() && !bannerGradient && !bannerUrl
                                  ? 'ring-2 ring-white ring-offset-2 ring-offset-[#313338]'
                                  : ''
                              }`}
                            />
                          ))}
                          <div className="flex items-center gap-2 ml-2">
                            <input
                              type="color"
                              value={bannerColor}
                              onChange={(e) => {
                                setBannerColor(e.target.value);
                                setBannerGradient('');
                                setBannerUrl('');
                              }}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                            />
                            <span className="font-mono text-xs text-[#dbdee1] bg-[#1e1f22] px-2 py-1.5 rounded">
                              {bannerColor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- SUB-TAB 5: EFFETS DE PROFIL --- */}
                  {profileSubTab === 'effects' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Wand2 className="w-4 h-4 text-[#a855f7]" />
                            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">
                              CATALOGUE D'EFFETS DE PROFIL ANIMÉS ({PROFILE_EFFECTS.length} EFFETS)
                            </label>
                          </div>
                          {profileEffect !== 'none' && (
                            <button
                              type="button"
                              onClick={() => setProfileEffect('none')}
                              className="text-[11px] text-[#5865f2] hover:underline"
                            >
                              Retirer l'effet
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#949ba4] mb-3">
                          Sélectionnez une ambiance visuelle immersive (sakura, cyber scanlines, lune de sang, vortex magique, blizzard, pluie matrix) qui s'affiche directement sur votre carte de profil et que tout le monde peut admirer !
                        </p>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
                          {CATALOG_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCatalogCategory(cat.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 border ${
                                catalogCategory === cat.id
                                  ? 'bg-[#5865f2] border-[#5865f2] text-white shadow-sm'
                                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-[#dbdee1] hover:border-[#35373c]'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Search input */}
                        <div className="relative mb-3">
                          <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                            placeholder="Rechercher un effet (sakura, cyber, feu, matrix, or, foudre...)"
                            className="w-full bg-[#1e1f22] text-[#dbdee1] rounded-lg pl-9 pr-3 py-1.5 text-xs border border-[#2b2d31] focus:border-[#5865f2] focus:outline-none"
                          />
                          {catalogSearch && (
                            <button
                              type="button"
                              onClick={() => setCatalogSearch('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#949ba4] hover:text-white"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {PROFILE_EFFECTS.filter((eff) => {
                            const matchCat = catalogCategory === 'all' || eff.category === catalogCategory || eff.id === 'none';
                            const matchQuery = !catalogSearch || eff.name.toLowerCase().includes(catalogSearch.toLowerCase()) || eff.description.toLowerCase().includes(catalogSearch.toLowerCase());
                            return matchCat && matchQuery;
                          }).map((eff) => {
                            const isSelected = profileEffect === eff.id;
                            return (
                              <button
                                key={eff.id}
                                type="button"
                                onClick={() => {
                                  setProfileEffect(eff.id);
                                  playMessageSound();
                                }}
                                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                  isSelected
                                    ? 'bg-[#5865f2]/20 border-[#5865f2] text-white shadow-md ring-1 ring-[#5865f2]'
                                    : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-white hover:border-[#35373c]'
                                }`}
                              >
                                <span className="text-2xl p-1.5 rounded-lg bg-[#2b2d31] shrink-0">{eff.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-sm font-bold text-white truncate">{eff.name}</span>
                                    {eff.badge && (
                                      <span className="bg-[#5865f2]/30 text-[#5865f2] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                                        {eff.badge}
                                      </span>
                                    )}
                                    {isSelected && <Check className="w-4 h-4 text-[#5865f2] shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-[#949ba4] mt-0.5 line-clamp-2">{eff.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: 1:1 Live Discord Profile Card Preview */}
                <div className="lg:col-span-5 flex flex-col items-center sticky top-4">
                  <div className="flex items-center justify-between w-[320px] mb-2.5">
                    <span className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider">
                      APERÇU EN DIRECT DU PROFIL
                    </span>
                    <span className="text-[10px] text-[#23a55a] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
                      Temps réel
                    </span>
                  </div>

                  <div className="w-[320px] bg-[#111214] rounded-2xl overflow-hidden shadow-2xl border border-[#232428] text-left relative">
                    {/* Live Profile Effect Layer Overlay */}
                    <ProfileEffectLayer effect={profileEffect} />

                    {/* Banner */}
                    <div
                      className="h-32 w-full relative transition-all"
                      style={liveBannerStyle}
                    >
                      <button
                        type="button"
                        onClick={() => setProfileSubTab('banner')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-20"
                        title="Modifier la bannière"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Avatar & Badges Layer */}
                    <div className="px-4 pb-4 relative z-20">
                      <div className="flex justify-between items-end -mt-12 mb-3">
                        <AvatarWithDecoration
                          avatarUrl={avatar}
                          decoration={avatarDecoration}
                          status={currentUser.status}
                          size="xl"
                        />

                        {/* Badges Row */}
                        <div className="bg-[#2b2d31]/85 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#35373c] shadow-sm">
                          {badges.map((bId) => {
                            const bObj = AVAILABLE_BADGES.find((b) => b.id === bId);
                            return bObj ? (
                              <span key={bId} title={bObj.name} className="text-sm">
                                {bObj.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Display name & Username & Pronouns */}
                      <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#35373c] space-y-2.5 mb-3 shadow-sm">
                        <div>
                          <UserDisplayName
                            name={displayName || 'Utilisateur'}
                            font={nameFont}
                            color={nameColor}
                            className="text-white text-lg leading-tight block"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#949ba4]">
                              @{username || 'user'}
                            </span>
                            {pronouns && (
                              <span className="text-[10px] bg-[#1e1f22] text-[#dbdee1] px-1.5 py-0.5 rounded font-medium">
                                {pronouns}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Custom Status */}
                        {customStatus && (
                          <div className="text-xs text-[#dbdee1] bg-[#1e1f22] p-2 rounded-lg border border-[#1e1f22] flex items-center gap-1.5">
                            <span>💬</span>
                            <span className="truncate">{customStatus}</span>
                          </div>
                        )}

                        <div className="h-[1px] bg-[#35373c]" />

                        {/* About Me */}
                        <div>
                          <span className="text-[10px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
                            À PROPOS DE MOI
                          </span>
                          <p className="text-xs text-[#dbdee1] whitespace-pre-wrap line-clamp-3">
                            {bio || 'Cet utilisateur n\'a pas encore rédigé de bio.'}
                          </p>
                        </div>

                        {/* Member Since */}
                        <div>
                          <span className="text-[10px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-0.5">
                            MEMBRE DISCORD DEPUIS
                          </span>
                          <span className="text-xs text-[#949ba4]">
                            {currentUser.joinedDiscord || 'Aujourd\'hui'}
                          </span>
                        </div>
                      </div>

                      {/* Mock Chat input */}
                      <div className="bg-[#2b2d31] px-3 py-2 rounded-lg text-xs text-[#949ba4] border border-[#35373c]">
                        Envoyer un message à @{username || 'user'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Discord Unsaved Changes Bottom Bar */}
              {hasChanges && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#111214] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-[#232428] flex items-center justify-between z-50 animate-in slide-in-from-bottom-5 duration-200">
                  <span className="text-sm font-semibold">
                    Attention — vous avez des modifications non enregistrées !
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-[#dbdee1] hover:underline"
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveProfile()}
                      className="px-5 py-2 bg-[#23a55a] hover:bg-[#1a8345] text-white text-xs font-bold rounded transition-colors shadow flex items-center gap-1.5"
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{isSaved ? 'Enregistré !' : 'Enregistrer les modifications'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'voice' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Paramètres Voix & Vidéo</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                    PÉRIPHÉRIQUE D'ENTRÉE
                  </label>
                  <select className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none">
                    <option>Microphone par défaut (Casque / Web Audio)</option>
                    <option>Realtek High Definition Audio</option>
                  </select>
                </div>

                {/* Mic Test Section */}
                <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#35373c] space-y-3">
                  <span className="text-sm font-bold text-white block">TEST DU MICRO</span>
                  <p className="text-xs text-[#949ba4]">
                    Parlez dans votre micro pour vérifier que Discord reçoit bien votre voix.
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsMicTesting(!isMicTesting)}
                      className={`px-4 py-2 rounded text-xs font-semibold text-white transition-colors ${
                        isMicTesting ? 'bg-[#f23f43] hover:bg-[#da373c]' : 'bg-[#5865f2] hover:bg-[#4752c4]'
                      }`}
                    >
                      {isMicTesting ? 'Arrêter le test' : 'Vérifier'}
                    </button>

                    {/* Animated Volume Meter */}
                    <div className="flex-1 h-3 bg-[#1e1f22] rounded-full overflow-hidden p-0.5 border border-[#35373c]">
                      <div
                        className="h-full bg-[#23a55a] rounded-full transition-all duration-75"
                        style={{ width: `${micVolume}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sound FX test */}
                <div>
                  <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                    EFFETS SONORES DISCORD
                  </label>
                  <button
                    onClick={playMessageSound}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2b2d31] hover:bg-[#35373c] text-white text-xs font-semibold rounded border border-[#35373c]"
                  >
                    <Volume2 className="w-4 h-4 text-[#5865f2]" />
                    <span>Tester le son de notification</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Apparence</h2>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
                  THÈME
                </span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#313338] border-2 border-[#5865f2] cursor-pointer text-white text-sm font-bold flex flex-col items-center gap-2">
                    <div className="w-12 h-8 rounded bg-[#1e1f22] border border-[#35373c]" />
                    <span>Sombre (Défaut)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#111214] border-2 border-transparent hover:border-[#35373c] cursor-pointer text-[#dbdee1] text-sm font-bold flex flex-col items-center gap-2">
                    <div className="w-12 h-8 rounded bg-[#0b0c0d] border border-[#2b2d31]" />
                    <span>Sombre Nuit</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#ffffff] border-2 border-transparent hover:border-[#35373c] cursor-pointer text-black text-sm font-bold flex flex-col items-center gap-2">
                    <div className="w-12 h-8 rounded bg-[#f2f3f5] border border-gray-300" />
                    <span>Clair</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keybinds' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Raccourcis clavier</h2>
              <div className="space-y-3">
                <div className="p-3 bg-[#2b2d31] rounded-lg border border-[#35373c] flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Sélecteur rapide (Recherche rapide)</span>
                  <kbd className="bg-[#1e1f22] text-[#dbdee1] px-2 py-1 rounded font-mono border border-[#35373c]">
                    Ctrl + K
                  </kbd>
                </div>
                <div className="p-3 bg-[#2b2d31] rounded-lg border border-[#35373c] flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Couper / Réactiver le micro</span>
                  <kbd className="bg-[#1e1f22] text-[#dbdee1] px-2 py-1 rounded font-mono border border-[#35373c]">
                    Ctrl + Shift + M
                  </kbd>
                </div>
                <div className="p-3 bg-[#2b2d31] rounded-lg border border-[#35373c] flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Fermer la modal / Revenir au chat</span>
                  <kbd className="bg-[#1e1f22] text-[#dbdee1] px-2 py-1 rounded font-mono border border-[#35373c]">
                    Escape
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
