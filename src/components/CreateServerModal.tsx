import React, { useState } from 'react';
import { X, Upload, Compass, Plus, ArrowRight } from 'lucide-react';

interface CreateServerModalProps {
  onClose: () => void;
  onCreateServer: (name: string, icon?: string) => void;
  onJoinServer?: (inviteCode: string) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  onClose,
  onCreateServer,
  onJoinServer,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [serverName, setServerName] = useState('Nouveau Serveur');
  const [iconUrl, setIconUrl] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    onCreateServer(serverName.trim(), iconUrl.trim() || undefined);
    onClose();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !onJoinServer) return;
    // Extract code from link if pasted as URL
    let code = inviteCode.trim();
    if (code.includes('invite=')) {
      code = code.split('invite=')[1]?.split('&')[0] || code;
    }
    onJoinServer(code);
    onClose();
  };

  return (
    <div
      id="modal-create-server-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="modal-create-server"
        className="w-full max-w-[440px] bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#232428] relative animate-in zoom-in-95 duration-150 select-none text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#949ba4] hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher */}
        <div className="flex border-b border-[#232428] bg-[#2b2d31]">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-[#5865f2] text-white bg-[#313338]'
                : 'border-transparent text-[#949ba4] hover:text-[#dbdee1]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Créer un serveur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'join'
                ? 'border-[#5865f2] text-white bg-[#313338]'
                : 'border-transparent text-[#949ba4] hover:text-[#dbdee1]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Rejoindre un serveur</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'create' ? (
            <>
              <h2 className="text-xl font-bold text-white mb-1.5">
                Personnalisez votre serveur
              </h2>
              <p className="text-xs text-[#949ba4] mb-5">
                Donnez une personnalité à votre nouveau serveur en choisissant un nom et une icône.
              </p>

              <form onSubmit={handleCreate} className="space-y-4 text-left">
                {/* Server Icon Mock */}
                <div className="flex justify-center mb-2">
                  <div className="relative group cursor-pointer w-20 h-20 rounded-full border-2 border-dashed border-[#b5bac1] flex flex-col items-center justify-center hover:border-white transition-colors bg-[#2b2d31] overflow-hidden">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#949ba4] group-hover:text-white mb-1" />
                        <span className="text-[9px] font-bold text-[#949ba4] group-hover:text-white uppercase">
                          UPLOAD
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1.5">
                    NOM DU SERVEUR
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                    placeholder="Ex: Serveur Gaming, Groupe d'amis..."
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1.5">
                    URL DE L'ICÔNE (OPTIONNEL)
                  </label>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-[#dbdee1] hover:underline"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!serverName.trim()}
                    className="px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-xs font-semibold rounded transition-colors shadow"
                  >
                    Créer le serveur
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1.5">
                Rejoindre un serveur
              </h2>
              <p className="text-xs text-[#949ba4] mb-5">
                Entrez un lien d'invitation ou un code pour rejoindre un serveur existant.
              </p>

              <form onSubmit={handleJoin} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1.5">
                    LIEN OU CODE D'INVITATION
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Ex: invite-gaming-xyz ou https://..."
                    className="w-full bg-[#1e1f22] text-[#dbdee1] rounded p-2.5 text-sm border border-[#1e1f22] focus:border-[#5865f2] focus:outline-none font-mono"
                    autoFocus
                    required
                  />
                  <span className="text-[11px] text-[#949ba4] mt-1 block">
                    Les invitations ressemblent à : <code>invite-xyz123</code>
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-[#dbdee1] hover:underline"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!inviteCode.trim()}
                    className="px-6 py-2 bg-[#23a55a] hover:bg-[#1f8b4d] disabled:opacity-50 text-white text-xs font-semibold rounded transition-colors shadow flex items-center gap-1.5"
                  >
                    <span>Rejoindre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
