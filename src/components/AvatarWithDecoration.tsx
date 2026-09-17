import React, { useState } from 'react';
import { UserStatus } from '../types';

interface AvatarWithDecorationProps {
  avatarUrl: string;
  decoration?: string;
  status?: UserStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alt?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  showStatus?: boolean;
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', img: 'w-6 h-6', dot: 'w-2 h-2 bottom-0 right-0 border', decor: '-inset-1' },
  sm: { box: 'w-8 h-8', img: 'w-8 h-8', dot: 'w-2.5 h-2.5 bottom-0 right-0 border-[1.5px]', decor: '-inset-1.5' },
  md: { box: 'w-10 h-10', img: 'w-10 h-10', dot: 'w-3.5 h-3.5 bottom-0 right-0 border-2', decor: '-inset-2' },
  lg: { box: 'w-14 h-14', img: 'w-14 h-14', dot: 'w-4 h-4 bottom-0 right-0 border-2', decor: '-inset-2.5' },
  xl: { box: 'w-20 h-20', img: 'w-20 h-20', dot: 'w-5 h-5 bottom-1 right-1 border-[3px]', decor: '-inset-3' },
  '2xl': { box: 'w-24 h-24', img: 'w-24 h-24', dot: 'w-6 h-6 bottom-1 right-1 border-4', decor: '-inset-3.5' },
};

const STATUS_COLOR_MAP: Record<UserStatus, string> = {
  online: 'bg-[#23a55a]',
  idle: 'bg-[#f0b232]',
  dnd: 'bg-[#f23f43]',
  offline: 'bg-[#80848e]',
};

export const AvatarWithDecoration: React.FC<AvatarWithDecorationProps> = ({
  avatarUrl,
  decoration = 'none',
  status,
  size = 'md',
  alt = 'Avatar',
  className = '',
  onClick,
  showStatus = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size];

  const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  const effectiveSrc = imgError || !avatarUrl ? fallbackAvatar : avatarUrl;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${s.box} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* --- AVATAR DECORATION FRAMES --- */}
      {decoration && decoration !== 'none' && (
        <div className={`absolute ${s.decor} pointer-events-none z-10 flex items-center justify-center`}>
          {/* Flame Ring */}
          {decoration === 'flame-ring' && (
            <div className="absolute inset-0 rounded-full animate-spin-slow border-2 border-dashed border-red-500 shadow-[0_0_12px_#ef4444,inset_0_0_8px_#f97316]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] animate-bounce">🔥</span>
            </div>
          )}

          {/* Cyber Hex */}
          {decoration === 'cyber-hex' && (
            <div className="absolute inset-0 rounded-lg rotate-45 border-2 border-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4,inset_0_0_6px_#06b6d4]" />
          )}

          {/* Sakura Crown */}
          {decoration === 'sakura-crown' && (
            <div className="absolute inset-0 rounded-full border-2 border-pink-400 shadow-[0_0_10px_#f472b6]">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[11px] drop-shadow-[0_0_6px_#f472b6]">🌸</span>
            </div>
          )}

          {/* Rainbow Spin */}
          {decoration === 'rainbow-spin' && (
            <div
              className="absolute inset-0 rounded-full p-[2px] animate-spin"
              style={{
                background: 'conic-gradient(from 0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)',
              }}
            >
              <div className="w-full h-full bg-[#111214] rounded-full" />
            </div>
          )}

          {/* Angel Wings & Halo */}
          {decoration === 'angel-wings' && (
            <>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[12px] animate-bounce text-amber-300 drop-shadow-[0_0_8px_#fbbf24]">
                ✨
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-amber-300/80 shadow-[0_0_10px_#f59e0b]" />
            </>
          )}

          {/* Devil Horns */}
          {decoration === 'devil-horns' && (
            <>
              <div className="absolute -top-2 inset-x-0 flex justify-between px-0.5 text-[11px] animate-pulse">
                <span>😈</span>
                <span>😈</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-red-600 shadow-[0_0_12px_#dc2626]" />
            </>
          )}

          {/* Sparkle Star */}
          {decoration === 'sparkle-star' && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-spin-slow shadow-[0_0_12px_#fbbf24]">
              <span className="absolute -top-1.5 -right-1.5 text-[10px]">⭐</span>
              <span className="absolute -bottom-1.5 -left-1.5 text-[10px]">✨</span>
            </div>
          )}

          {/* Radioactive */}
          {decoration === 'radioactive' && (
            <div className="absolute inset-0 rounded-full border-2 border-lime-400 animate-pulse shadow-[0_0_12px_#84cc16]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">☣️</span>
            </div>
          )}

          {/* Matrix Ring */}
          {decoration === 'matrix-ring' && (
            <div className="absolute inset-0 rounded-full border-2 border-green-500 shadow-[0_0_10px_#22c55e]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-green-400 font-bold">
                01
              </span>
            </div>
          )}

          {/* Neon Cat Ears */}
          {decoration === 'neon-cat-ears' && (
            <>
              <div className="absolute -top-2.5 inset-x-0 flex justify-between px-0.5 text-[11px]">
                <span className="animate-pulse">🐱</span>
                <span className="animate-pulse">🐱</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-pink-500 shadow-[0_0_12px_#ec4899]" />
            </>
          )}

          {/* Thunder Storm */}
          {decoration === 'thunder-storm' && (
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse shadow-[0_0_12px_#06b6d4]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[11px] animate-bounce">⚡</span>
            </div>
          )}

          {/* Blood Vampire */}
          {decoration === 'blood-vampire' && (
            <>
              <div className="absolute -top-2.5 inset-x-0 flex justify-between px-0.5 text-[10px]">
                <span>🦇</span>
                <span>🦇</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-red-800 shadow-[0_0_14px_#991b1b]" />
            </>
          )}

          {/* Demon Slayer */}
          {decoration === 'demon-slayer' && (
            <div className="absolute inset-0 rounded-full border-2 border-purple-600 animate-pulse shadow-[0_0_14px_#7c3aed]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">⚔️</span>
            </div>
          )}

          {/* Kawaii Bunny */}
          {decoration === 'kawaii-bunny' && (
            <>
              <div className="absolute -top-2.5 inset-x-0 flex justify-between px-1 text-[11px]">
                <span>🐰</span>
                <span>🐰</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-rose-300 shadow-[0_0_10px_#fda4af]" />
            </>
          )}

          {/* Bubble Aquatic */}
          {decoration === 'bubble-aquatic' && (
            <div className="absolute inset-0 rounded-full border-2 border-sky-400 shadow-[0_0_10px_#38bdf8]">
              <span className="absolute -top-1.5 -right-1 text-[9px]">🫧</span>
              <span className="absolute -bottom-1.5 -left-1 text-[9px]">🫧</span>
            </div>
          )}

          {/* Golden Laurel */}
          {decoration === 'golden-laurel' && (
            <>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[12px] drop-shadow-[0_0_8px_#f59e0b]">
                👑
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-amber-400 shadow-[0_0_12px_#f59e0b]" />
            </>
          )}

          {/* Holy Halo */}
          {decoration === 'holy-halo' && (
            <>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[12px] animate-pulse drop-shadow-[0_0_8px_#fde047]">
                ✨
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-yellow-300/90 shadow-[0_0_14px_#fde047]" />
            </>
          )}

          {/* Dragon Horns */}
          {decoration === 'dragon-horns' && (
            <>
              <div className="absolute -top-2.5 inset-x-0 flex justify-between px-0.5 text-[11px]">
                <span>🐉</span>
                <span>🐉</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-amber-600 shadow-[0_0_12px_#ea580c]" />
            </>
          )}

          {/* Pixel Crown */}
          {decoration === 'pixel-crown' && (
            <>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[11px]">👾</span>
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400 shadow-[0_0_8px_#eab308]" />
            </>
          )}

          {/* Synthwave Sun */}
          {decoration === 'synthwave-sun' && (
            <div className="absolute inset-0 rounded-full border-2 border-pink-500 shadow-[0_0_12px_#ec4899]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">🌅</span>
            </div>
          )}

          {/* Ice Crystal */}
          {decoration === 'ice-crystal' && (
            <div className="absolute inset-0 rounded-full border-2 border-sky-300 shadow-[0_0_12px_#7dd3fc]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">❄️</span>
            </div>
          )}

          {/* Magic Runes */}
          {decoration === 'magic-runes' && (
            <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-spin-slow shadow-[0_0_12px_#c084fc]">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px]">🔮</span>
            </div>
          )}

          {/* Space Orbit */}
          {decoration === 'space-orbit' && (
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-spin-slow shadow-[0_0_10px_#818cf8]">
              <span className="absolute -top-1.5 -right-1 text-[9px]">🪐</span>
            </div>
          )}
        </div>
      )}

      {/* Main Avatar Image / Animated GIF */}
      <img
        src={effectiveSrc}
        alt={alt}
        onError={() => setImgError(true)}
        className={`${s.img} rounded-full object-cover bg-[#2b2d31] relative z-0 transition-transform hover:scale-[1.02]`}
        referrerPolicy="no-referrer"
      />

      {/* Status Dot */}
      {showStatus && status && (
        <span
          className={`absolute ${s.dot} rounded-full border-[#111214] z-20 ${STATUS_COLOR_MAP[status]}`}
        />
      )}
    </div>
  );
};
