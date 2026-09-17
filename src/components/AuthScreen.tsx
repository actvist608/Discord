import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Eye, EyeOff, Sparkles, User as UserIcon, Lock, AtSign, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

const AVATAR_PRESETS = [
  {
    name: 'Gamer Blurple',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cyberpunk Boy',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neon Girl',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Anime Style',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Techie Beard',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cool Headset',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(true);

  // Register Fields
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [pronouns, setPronouns] = useState('il/lui');

  // Login Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // Fetch available accounts on mount for quick testing
  useEffect(() => {
    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setRegisteredUsers(data.users);
        }
      })
      .catch(() => {});
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Veuillez renseigner un nom d\'utilisateur.');
      return;
    }
    if (password.length < 4) {
      setError('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      const avatarToUse = customAvatarUrl.trim() || selectedAvatar;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          displayName: displayName.trim() || username.trim(),
          username: username.trim(),
          password,
          avatar: avatarToUse,
          pronouns: pronouns.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible de créer le compte.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginIdentifier.trim()) {
      setError('Veuillez entrer votre nom d\'utilisateur ou e-mail.');
      return;
    }
    if (!loginPassword) {
      setError('Veuillez entrer votre mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nom d\'utilisateur ou mot de passe incorrect.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (u: User) => {
    setLoginIdentifier(u.username);
    setLoginPassword('password123');
    setIsRegisterMode(false);
    setError(null);
  };

  return (
    <div
      id="discord-auth-wrapper"
      className="relative min-h-screen w-full bg-[#1e1f22] flex items-center justify-center p-4 select-none overflow-y-auto"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(88, 101, 242, 0.12) 0%, transparent 60%)`,
      }}
    >
      {/* Background Decorative Discord Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#5865F2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#23a55a]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Box */}
      <div
        id="auth-card"
        className="relative z-10 w-full max-w-[800px] bg-[#313338] text-white rounded-lg shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch border border-[#232428]"
      >
        {/* Left / Primary Form Column */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Discord Logo & Brand Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 fill-white"
                  viewBox="0 0 127.14 96.36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.86,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.86,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
              </div>
              <div>
                <span className="font-black tracking-widest text-sm text-white uppercase">DISCORD</span>
                <span className="block text-xs text-[#949ba4]">Messagerie & Salons en direct</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-white mb-1.5">
              {isRegisterMode ? 'Créer un compte' : 'De retour parmi nous !'}
            </h1>
            <p className="text-sm text-[#949ba4] mb-6">
              {isRegisterMode
                ? 'Choisissez votre identité pour chatter en direct avec tout le monde.'
                : 'Nous sommes ravis de vous revoir !'}
            </p>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded bg-[#f23f43]/15 border border-[#f23f43]/60 flex items-start gap-2.5 text-[#fa777c] text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Registration Form */}
            {isRegisterMode ? (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nom d'affichage */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Nom d'affichage <span className="text-[#f23f43]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Comment souhaitez-vous être appelé(e) ?"
                      className="w-full h-10 bg-[#1e1f22] text-[#dbdee1] rounded px-3 text-sm border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                    />
                  </div>
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Nom d'utilisateur <span className="text-[#f23f43]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#949ba4] text-sm">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="nom_utilisateur_unique"
                      className="w-full h-10 bg-[#1e1f22] text-[#dbdee1] rounded pl-7 pr-3 text-sm border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058] font-mono text-xs"
                    />
                  </div>
                  <p className="text-[10px] text-[#949ba4] mt-1">
                    Lettres minuscules, chiffres et tirets du bas uniquement.
                  </p>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Mot de passe <span className="text-[#f23f43]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Au moins 4 caractères"
                      className="w-full h-10 bg-[#1e1f22] text-[#dbdee1] rounded px-3 pr-10 text-sm border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#949ba4] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Choisir un Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected = selectedAvatar === p.url && !customAvatarUrl;
                      return (
                        <button
                          type="button"
                          key={p.url}
                          onClick={() => {
                            setSelectedAvatar(p.url);
                            setCustomAvatarUrl('');
                          }}
                          className={`relative rounded-full aspect-square overflow-hidden border-2 transition-all p-0.5 ${
                            isSelected
                              ? 'border-[#5865F2] scale-105 shadow-md shadow-[#5865F2]/40'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          title={p.name}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#5865F2]/30 flex items-center justify-center rounded-full">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="Ou collez une URL d'image personnalisée"
                    className="w-full h-8 bg-[#1e1f22] text-[11px] text-[#dbdee1] rounded px-3 border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                  />
                </div>

                {/* Pronoms (Optionnel) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Pronoms <span className="text-[#949ba4] font-normal">(Optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="ex: il/lui, elle, iel..."
                    className="w-full h-9 bg-[#1e1f22] text-[#dbdee1] rounded px-3 text-xs border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold rounded text-sm transition-colors mt-4 flex items-center justify-center gap-2 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Création de votre compte...</span>
                    </>
                  ) : (
                    <span>Continuer</span>
                  )}
                </button>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Identifiant */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Nom d'utilisateur ou E-mail <span className="text-[#f23f43]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="votre_nom ou email"
                      className="w-full h-10 bg-[#1e1f22] text-[#dbdee1] rounded px-3 text-sm border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider mb-2">
                    Mot de passe <span className="text-[#f23f43]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 bg-[#1e1f22] text-[#dbdee1] rounded px-3 pr-10 text-sm border border-transparent focus:border-[#5865F2] focus:outline-none placeholder:text-[#4e5058]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#949ba4] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold rounded text-sm transition-colors mt-2 flex items-center justify-center gap-2 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <span>Se connecter</span>
                  )}
                </button>
              </form>
            )}

            {/* Mode Switch Toggle */}
            <div className="mt-5 text-xs text-[#949ba4]">
              {isRegisterMode ? (
                <p>
                  Tu as déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setError(null);
                    }}
                    className="text-[#00a8fc] hover:underline font-medium"
                  >
                    Se connecter
                  </button>
                </p>
              ) : (
                <p>
                  Besoin d'un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setError(null);
                    }}
                    className="text-[#00a8fc] hover:underline font-medium"
                  >
                    S'inscrire
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column / Quick Demo Accounts & QR Code */}
        <div className="md:w-[260px] border-t md:border-t-0 md:border-l border-[#35373c] pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider block mb-3">
              Comptes Rapides
            </span>
            <p className="text-xs text-[#949ba4] mb-3 leading-relaxed">
              Cliquez sur un profil existant pour préremplir la connexion :
            </p>

            <div className="space-y-2">
              {registeredUsers.length > 0 ? (
                registeredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="w-full p-2 rounded-lg bg-[#2b2d31] hover:bg-[#35373c] transition-colors flex items-center gap-2.5 text-left group"
                  >
                    <img
                      src={u.avatar}
                      alt={u.displayName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-[#dbdee1] group-hover:text-white truncate">
                        {u.displayName}
                      </span>
                      <span className="text-[10px] text-[#949ba4] truncate">@{u.username}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-xs text-[#949ba4] italic py-2">
                  Aucun compte préenregistré
                </div>
              )}
            </div>
          </div>

          {/* Realistic Discord QR Code info card */}
          <div className="mt-6 p-3 rounded-lg bg-[#2b2d31]/70 border border-[#232428] text-center">
            <div className="w-24 h-24 mx-auto mb-2 bg-white p-2 rounded flex items-center justify-center shadow">
              {/* Stylized QR Code SVG */}
              <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h3v1h-3v-1zm0 2h1v3h-1v-3zm2 2h3v2h-3v-2zm3-1h2v1h-2v-1zm-7-2h1v1h-1v-1zm1 3h2v1h-2v-1zm3 1h1v2h-1v-2zm-2 2h2v1h-2v-1z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-white block">Se connecter par code QR</span>
            <span className="text-[10px] text-[#949ba4] leading-tight block mt-1">
              Scannez ceci avec l'application mobile pour une connexion immédiate.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
