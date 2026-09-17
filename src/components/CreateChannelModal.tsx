import React, { useState } from 'react';
import { Channel } from '../types';
import { Hash, Volume2, Lock, X } from 'lucide-react';

interface CreateChannelModalProps {
  categoryId?: string;
  onClose: () => void;
  onCreateChannel: (name: string, type: 'text' | 'voice', categoryId?: string) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  categoryId,
  onClose,
  onCreateChannel,
}) => {
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [channelName, setChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;
    const formattedName = channelType === 'text'
      ? channelName.trim().toLowerCase().replace(/\s+/g, '-')
      : channelName.trim();
    onCreateChannel(formattedName, channelType, categoryId);
    onClose();
  };

  return (
    <div
      id="modal-create-channel-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="modal-create-channel"
        className="w-full max-w-[460px] bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#232428] relative animate-in zoom-in-95 duration-150 select-none text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#232428] flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Créer un salon</h2>
          <button
            onClick={onClose}
            className="text-[#949ba4] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
              TYPE DE SALON
            </label>

            {/* Text option */}
            <div
              onClick={() => setChannelType('text')}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors mb-2 ${
                channelType === 'text'
                  ? 'bg-[#2b2d31] border-[#5865f2]'
                  : 'bg-[#2b2d31]/50 border-transparent hover:bg-[#2b2d31]'
              }`}
            >
              <Hash className="w-6 h-6 text-[#949ba4]" />
              <div className="flex-1">
                <span className="font-bold text-sm text-white block">Textuel</span>
                <span className="text-xs text-[#949ba4]">
                  Postez des messages, images, mèmes et opinions
                </span>
              </div>
              <input
                type="radio"
                checked={channelType === 'text'}
                onChange={() => setChannelType('text')}
                className="accent-[#5865f2] w-4 h-4"
              />
            </div>

            {/* Voice option */}
            <div
              onClick={() => setChannelType('voice')}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                channelType === 'voice'
                  ? 'bg-[#2b2d31] border-[#5865f2]'
                  : 'bg-[#2b2d31]/50 border-transparent hover:bg-[#2b2d31]'
              }`}
            >
              <Volume2 className="w-6 h-6 text-[#949ba4]" />
              <div className="flex-1">
                <span className="font-bold text-sm text-white block">Vocal</span>
                <span className="text-xs text-[#949ba4]">
                  Discutez en vocal, vidéo et partagez votre écran
                </span>
              </div>
              <input
                type="radio"
                checked={channelType === 'voice'}
                onChange={() => setChannelType('voice')}
                className="accent-[#5865f2] w-4 h-4"
              />
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
              NOM DU SALON
            </label>
            <div className="flex items-center bg-[#1e1f22] rounded px-3 py-2 border border-[#1e1f22] focus-within:border-[#5865f2]">
              {channelType === 'text' ? (
                <Hash className="w-4 h-4 text-[#949ba4] mr-2" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#949ba4] mr-2" />
              )}
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="nouveau-salon"
                className="w-full bg-transparent text-sm text-[#dbdee1] focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Private Channel Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#949ba4]" />
              <div>
                <span className="text-sm font-semibold text-white block">Salon privé</span>
                <span className="text-xs text-[#949ba4]">
                  Seuls les membres et rôles sélectionnés pourront voir ce salon
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="accent-[#5865f2] w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#dbdee1] hover:underline"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!channelName.trim()}
              className="px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-sm font-semibold rounded transition-colors shadow"
            >
              Créer un salon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
