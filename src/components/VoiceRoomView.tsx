import React, { useState } from 'react';
import { User, VoiceState } from '../types';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Volume2,
  Sparkles,
  Smile,
  Radio,
} from 'lucide-react';
import { playAirhorn, playQuack, playApplause, playLeaveSound } from '../utils/audio';

interface VoiceRoomViewProps {
  channelName: string;
  voiceState: VoiceState;
  currentUser: User;
  connectedUsers: User[];
  onDisconnect: () => void;
  onToggleMute: () => void;
  onToggleScreenShare: () => void;
  onToggleVideo: () => void;
}

export const VoiceRoomView: React.FC<VoiceRoomViewProps> = ({
  channelName,
  voiceState,
  currentUser,
  connectedUsers,
  onDisconnect,
  onToggleMute,
  onToggleScreenShare,
  onToggleVideo,
}) => {
  const [activeSoundboard, setActiveSoundboard] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Record<string, boolean>>({
    [currentUser.id]: false,
    'user_alex': true,
  });

  const allUsers = [currentUser, ...connectedUsers.filter((u) => u.id !== currentUser.id)];

  const soundboardItems = [
    { name: 'Airhorn 🎺', action: playAirhorn },
    { name: 'Canard 🦆', action: playQuack },
    { name: 'Applaudissements 👏', action: playApplause },
    {
      name: 'GGWP 🎮',
      action: () => {
        playApplause();
      },
    },
  ];

  return (
    <div
      id="discord-voice-stage"
      className="flex-1 bg-[#1e1f22] flex flex-col justify-between p-4 relative overflow-hidden select-none"
    >
      {/* Voice Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#23a55a]" />
          <h2 className="text-white font-bold text-lg">{channelName}</h2>
          <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> RTC 24ms
          </span>
        </div>

        {/* Soundboard trigger */}
        <button
          onClick={() => setActiveSoundboard(!activeSoundboard)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            activeSoundboard
              ? 'bg-[#5865f2] text-white'
              : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#f0b232]" />
          <span>Soundboard</span>
        </button>
      </div>

      {/* Soundboard Popover */}
      {activeSoundboard && (
        <div className="absolute top-16 right-4 w-64 bg-[#2b2d31] border border-[#35373c] rounded-xl p-3 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
          <span className="text-xs font-bold text-[#949ba4] uppercase tracking-wider block mb-2">
            Soundboard Discord
          </span>
          <div className="grid grid-cols-2 gap-2">
            {soundboardItems.map((sb, idx) => (
              <button
                key={idx}
                onClick={sb.action}
                className="flex items-center justify-center p-2.5 bg-[#1e1f22] hover:bg-[#5865f2] text-xs font-medium text-white rounded-lg transition-colors border border-[#35373c]/50 active:scale-95"
              >
                {sb.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stage Grid: Screen Share & User Tiles */}
      <div className="flex-1 flex items-center justify-center p-4 my-2">
        {voiceState.isScreenSharing ? (
          // Simulated Screenshare Stream
          <div className="w-full h-full max-h-[520px] bg-[#111214] rounded-2xl overflow-hidden border border-[#2b2d31] relative flex flex-col shadow-2xl">
            <div className="bg-[#2b2d31] px-4 py-2 flex items-center justify-between border-b border-[#1e1f22] text-xs text-[#dbdee1]">
              <div className="flex items-center gap-2 font-semibold">
                <Monitor className="w-4 h-4 text-[#5865f2]" />
                <span>Écran de {currentUser.displayName} — Visual Studio Code (Live)</span>
              </div>
              <span className="bg-[#f23f43] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                EN DIRECT
              </span>
            </div>

            {/* Code stream mockup */}
            <div className="flex-1 bg-[#1e1e1e] p-6 font-mono text-sm text-[#d4d4d4] overflow-hidden flex flex-col justify-center">
              <p className="text-[#6a9955]">// Discord 1:1 Live Code Stream</p>
              <p>
                <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">discordVoiceEngine</span> = {'{'}
              </p>
              <p className="pl-4">
                <span className="text-[#9cdcfe]">status</span>: <span className="text-[#ce9178]">'connected'</span>,
              </p>
              <p className="pl-4">
                <span className="text-[#9cdcfe]">bitrate</span>: <span className="text-[#b5cea8]">128000</span>,
              </p>
              <p className="pl-4">
                <span className="text-[#9cdcfe]">codec</span>: <span className="text-[#ce9178]">'Opus 48kHz'</span>,
              </p>
              <p className="pl-4">
                <span className="text-[#9cdcfe]">latency</span>: <span className="text-[#b5cea8]">22</span> <span className="text-[#6a9955]">/* ms */</span>,
              </p>
              <p>{'}'};</p>
              <div className="mt-4 p-3 bg-[#252526] rounded border border-[#3e3e42] flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#23a55a] animate-ping" />
                <span className="text-xs text-[#9cdcfe]">Flux audio et vidéo synchronisés à 60 FPS</span>
              </div>
            </div>
          </div>
        ) : (
          // Grid of User Tiles
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
            {allUsers.map((user) => {
              const isSpeaking = speakingUsers[user.id] || (user.id === currentUser.id && voiceState.isSpeaking);
              const isUserMuted = user.id === currentUser.id ? voiceState.isMuted : false;

              return (
                <div
                  key={user.id}
                  className={`relative aspect-video bg-[#2b2d31] rounded-2xl flex flex-col items-center justify-center transition-all duration-150 border-2 ${
                    isSpeaking
                      ? 'border-[#23a55a] shadow-[0_0_20px_rgba(35,165,90,0.4)]'
                      : 'border-transparent hover:border-[#35373c]'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <AvatarWithDecoration
                      avatarUrl={user.avatar}
                      decoration={user.avatarDecoration}
                      size="xl"
                      showStatus={false}
                    />
                    {isSpeaking && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#23a55a] animate-ping opacity-60 pointer-events-none" />
                    )}
                  </div>

                  {/* Name badge */}
                  <div className="absolute bottom-3 left-3 bg-[#111214]/80 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs text-white font-semibold">
                    <UserDisplayName
                      name={user.displayName}
                      font={user.nameFont}
                      color={user.nameColor}
                      className="text-xs text-white"
                    />
                    {isUserMuted && <MicOff className="w-3.5 h-3.5 text-[#f23f43]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Voice Bottom Control Bar */}
      <div className="bg-[#2b2d31] max-w-xl mx-auto w-full py-3 px-6 rounded-2xl flex items-center justify-center gap-4 shadow-2xl border border-[#35373c] z-10">
        {/* Mute Mic */}
        <button
          onClick={onToggleMute}
          title={voiceState.isMuted ? 'Activer le micro' : 'Couper le micro'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            voiceState.isMuted
              ? 'bg-[#f23f43] text-white hover:bg-[#da373c]'
              : 'bg-[#35373c] text-white hover:bg-[#404249]'
          }`}
        >
          {voiceState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Camera */}
        <button
          onClick={onToggleVideo}
          title={voiceState.isVideoOn ? 'Couper la caméra' : 'Activer la caméra'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            voiceState.isVideoOn
              ? 'bg-[#23a55a] text-white hover:bg-[#1f934f]'
              : 'bg-[#35373c] text-white hover:bg-[#404249]'
          }`}
        >
          {voiceState.isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Share Screen */}
        <button
          onClick={onToggleScreenShare}
          title={voiceState.isScreenSharing ? 'Arrêter le partage d\'écran' : 'Partager votre écran'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
            voiceState.isScreenSharing
              ? 'bg-[#5865f2] text-white hover:bg-[#4752c4]'
              : 'bg-[#35373c] text-white hover:bg-[#404249]'
          }`}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Disconnect */}
        <button
          onClick={() => {
            playLeaveSound();
            onDisconnect();
          }}
          title="Déconnecter"
          className="w-12 h-12 rounded-full bg-[#f23f43] hover:bg-[#da373c] text-white flex items-center justify-center transition-transform active:scale-95"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
