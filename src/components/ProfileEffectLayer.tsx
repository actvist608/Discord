import React from 'react';

interface ProfileEffectLayerProps {
  effect?: string;
  className?: string;
}

export const ProfileEffectLayer: React.FC<ProfileEffectLayerProps> = ({ effect = 'none', className = '' }) => {
  if (!effect || effect === 'none') return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
      {/* 1. SAKURA BLOSSOM */}
      {effect === 'sakura' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-rose-950/20" />
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute text-pink-300 select-none animate-sakura-fall opacity-85"
              style={{
                left: `${(i * 8 + 3) % 100}%`,
                top: `-${15 + (i * 8)}px`,
                fontSize: `${11 + (i % 4) * 3}px`,
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${3.4 + (i % 3)}s`,
                filter: 'drop-shadow(0 0 6px rgba(244, 114, 182, 0.7))',
              }}
            >
              🌸
            </span>
          ))}
        </div>
      )}

      {/* 2. CYBERPUNK NEON */}
      {effect === 'cyberpunk' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0) 50%, rgba(6, 182, 212, 0.4) 50%), linear-gradient(90deg, rgba(236, 72, 153, 0.1), rgba(6, 182, 212, 0.1))',
              backgroundSize: '100% 4px, 6px 100%',
            }}
          />
          <div className="absolute inset-0 border border-cyan-400/40 shadow-[inset_0_0_20px_rgba(6,182,212,0.25)]" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-scanline" />
          <div className="absolute bottom-2 right-2 text-[9px] font-mono font-bold tracking-widest text-cyan-400/80">
            [SYS_CYBER//ONLINE]
          </div>
        </div>
      )}

      {/* 3. MATRIX RAIN */}
      {effect === 'matrix' && (
        <div className="absolute inset-0 bg-black/40">
          <div className="absolute inset-0 border border-green-500/30 shadow-[inset_0_0_15px_rgba(34,197,94,0.25)]" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 font-mono text-[10px] leading-3 select-none animate-matrix-rain opacity-80"
              style={{
                left: `${(i * 9 + 2) % 96}%`,
                top: '-20px',
                animationDelay: `${i * 0.28}s`,
                animationDuration: `${2.4 + (i % 3) * 0.7}s`,
                textShadow: '0 0 6px #22c55e',
              }}
            >
              10101<br />01100<br />11010<br />00101
            </div>
          ))}
        </div>
      )}

      {/* 4. TOKYO MIDNIGHT NEON */}
      {effect === 'neon-tokyo' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950/40 via-purple-900/15 to-transparent animate-pulse-glow" />
          <div className="absolute inset-0 border border-pink-500/30 shadow-[inset_0_0_25px_rgba(236,72,153,0.3)]" />
          <div className="absolute top-2 left-3 text-[10px] font-mono font-bold text-pink-400 drop-shadow-[0_0_8px_#ec4899]">
            東京 // TOKYO NIGHTS
          </div>
          <div className="absolute bottom-2 right-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-mono text-cyan-300">NEON ACTIVE</span>
          </div>
        </div>
      )}

      {/* 5. GLITCH VHS */}
      {effect === 'glitch-vhs' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.8) 0px, rgba(0,0,0,0.8) 1px, transparent 1px, transparent 2px)',
            }}
          />
          <div className="absolute top-2 left-2 text-[10px] font-mono text-red-500 font-bold animate-pulse">
            REC ● PLAY [SP]
          </div>
          <div className="absolute inset-0 border border-red-500/30 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40 shadow-[0_0_8px_white] animate-scanline" />
        </div>
      )}

      {/* 6. GALAXY STARS */}
      {effect === 'galaxy' && (
        <div className="absolute inset-0 bg-radial from-purple-900/20 via-transparent to-black/30">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${(i * 7 + 4) % 96}%`,
                top: `${(i * 13 + 6) % 94}%`,
                width: `${i % 3 === 0 ? 3 : 2}px`,
                height: `${i % 3 === 0 ? 3 : 2}px`,
                boxShadow: i % 2 === 0 ? '0 0 8px #a855f7, 0 0 14px #ec4899' : '0 0 6px #38bdf8',
                animationDelay: `${i * 0.25}s`,
                animationDuration: `${1.8 + (i % 3) * 0.7}s`,
              }}
            />
          ))}
          <div className="absolute top-4 left-4 w-16 h-[1.5px] bg-gradient-to-r from-transparent via-white to-purple-400 rotate-[-35deg] animate-shooting-star" />
        </div>
      )}

      {/* 7. LIGHTNING ELECTRIC */}
      {effect === 'lightning' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-500/5 animate-lightning-flash" />
          <div className="absolute inset-0 border border-blue-400/30 shadow-[inset_0_0_15px_rgba(59,130,246,0.3)]" />
          <div className="absolute top-2 right-4 text-blue-300 select-none animate-bounce text-sm drop-shadow-[0_0_8px_#3b82f6]">
            ⚡
          </div>
          <div className="absolute bottom-3 left-3 text-cyan-300 select-none animate-pulse text-xs drop-shadow-[0_0_8px_#06b6d4]">
            ⚡
          </div>
        </div>
      )}

      {/* 8. SUPERNOVA PRISMATIC */}
      {effect === 'starlight-supernova' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-cyan-500/10 to-amber-500/10" />
          {['✨', '✦', '⭐', '💫', '✦'].map((star, i) => (
            <span
              key={i}
              className="absolute select-none animate-twinkle text-xs"
              style={{
                left: `${12 + i * 20}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.4}s`,
                filter: 'drop-shadow(0 0 8px rgba(192, 132, 252, 0.8))',
              }}
            >
              {star}
            </span>
          ))}
        </div>
      )}

      {/* 9. OCEAN ABYSS */}
      {effect === 'ocean-abyss' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-blue-900/15 to-transparent" />
          <div className="absolute inset-0 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(14,165,233,0.2)]" />
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-cyan-300 select-none animate-bubble-rise opacity-75 text-xs"
              style={{
                left: `${(i * 9 + 5) % 95}%`,
                bottom: '-10px',
                animationDelay: `${i * 0.35}s`,
                animationDuration: `${3.2 + (i % 3) * 0.6}s`,
                filter: 'drop-shadow(0 0 6px #38bdf8)',
              }}
            >
              🫧
            </span>
          ))}
        </div>
      )}

      {/* 10. KAWAII HEARTS */}
      {effect === 'hearts' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/15 via-rose-400/5 to-transparent" />
          {['💖', '✨', '💕', '🌸', '💘', '⭐', '💗'].map((emoji, i) => (
            <span
              key={i}
              className="absolute select-none animate-heart-float text-sm drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]"
              style={{
                left: `${10 + i * 13}%`,
                bottom: '-10px',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3.2 + (i % 2)}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* 11. BUTTERFLY DREAM */}
      {effect === 'butterfly-dream' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-950/20 via-purple-600/5 to-transparent" />
          {['🦋', '✨', '🦋', '💜', '🦋'].map((item, i) => (
            <span
              key={i}
              className="absolute select-none animate-heart-float text-xs drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]"
              style={{
                left: `${15 + i * 18}%`,
                bottom: '-10px',
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + (i % 2)}s`,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* 12. CHERRY SUNSET MOMIJI */}
      {effect === 'cherry-sunset' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-amber-500/5 to-rose-950/25" />
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute text-orange-400 select-none animate-leaf-fall opacity-85 text-xs"
              style={{
                left: `${(i * 11 + 4) % 96}%`,
                top: `-${15 + (i * 6)}px`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3.8 + (i % 3) * 0.5}s`,
                filter: 'drop-shadow(0 0 6px #f97316)',
              }}
            >
              🍁
            </span>
          ))}
        </div>
      )}

      {/* 13. FIRE INFERNO */}
      {effect === 'fire' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/25 via-orange-500/10 to-transparent" />
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-amber-400 animate-fire-ember"
              style={{
                left: `${(i * 8 + 6) % 98}%`,
                bottom: '-5px',
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                boxShadow: '0 0 10px #f97316, 0 0 18px #ef4444',
                animationDelay: `${i * 0.25}s`,
                animationDuration: `${1.6 + (i % 3) * 0.5}s`,
              }}
            />
          ))}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-red-600/30 to-transparent blur-xs" />
        </div>
      )}

      {/* 14. DARK VOID */}
      {effect === 'void' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-violet-900/15 to-transparent animate-pulse" />
          <div className="absolute inset-0 border border-purple-500/30 shadow-[inset_0_0_25px_rgba(139,92,246,0.3)]" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-600/15 rounded-full blur-2xl animate-spin-slow" />
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-600/15 rounded-full blur-2xl animate-spin-slow" />
        </div>
      )}

      {/* 15. BLOOD MOON */}
      {effect === 'blood-moon' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 via-rose-950/20 to-black/40" />
          <div className="absolute inset-0 border border-red-600/30 shadow-[inset_0_0_20px_rgba(220,38,38,0.3)]" />
          {['🩸', '🦇', '🩸', '🦇'].map((symbol, i) => (
            <span
              key={i}
              className="absolute select-none animate-twinkle text-xs drop-shadow-[0_0_8px_#dc2626]"
              style={{
                left: `${15 + i * 24}%`,
                top: `${18 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              {symbol}
            </span>
          ))}
        </div>
      )}

      {/* 16. TOXIC BIOHAZARD */}
      {effect === 'toxic' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-lime-950/40 via-emerald-950/20 to-transparent" />
          <div className="absolute inset-0 border border-lime-400/30 shadow-[inset_0_0_20px_rgba(132,204,22,0.3)]" />
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute text-lime-400 select-none animate-bubble-rise opacity-80 text-xs"
              style={{
                left: `${(i * 10 + 6) % 95}%`,
                bottom: '-10px',
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2.8 + (i % 2)}s`,
                filter: 'drop-shadow(0 0 8px #84cc16)',
              }}
            >
              ☣️
            </span>
          ))}
        </div>
      )}

      {/* 17. ROYAL GOLD */}
      {effect === 'gold' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/15 via-transparent to-amber-950/25" />
          <div className="absolute inset-0 border border-amber-400/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.25)]" />
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-amber-300 select-none animate-pulse text-xs"
              style={{
                left: `${(i * 9 + 6) % 94}%`,
                top: `${(i * 14 + 7) % 90}%`,
                animationDelay: `${i * 0.25}s`,
                animationDuration: '2s',
                filter: 'drop-shadow(0 0 8px #f59e0b)',
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}

      {/* 18. ANGELIC CELESTIAL */}
      {effect === 'angelic' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 via-yellow-200/5 to-transparent animate-pulse-glow" />
          <div className="absolute inset-0 border border-amber-200/40 shadow-[inset_0_0_25px_rgba(253,224,71,0.25)]" />
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-amber-100 select-none animate-feather-drift opacity-85 text-xs"
              style={{
                left: `${(i * 13 + 7) % 92}%`,
                top: `-${15 + i * 5}px`,
                animationDelay: `${i * 0.5}s`,
                filter: 'drop-shadow(0 0 6px #fde047)',
              }}
            >
              🪶
            </span>
          ))}
        </div>
      )}

      {/* 19. DRAGON FURY */}
      {effect === 'dragon-fury' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 via-orange-500/10 to-transparent" />
          <div className="absolute inset-0 border border-amber-500/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.3)]" />
          <div className="absolute bottom-2 left-2 text-xs font-bold text-amber-400 drop-shadow-[0_0_8px_#f59e0b]">
            🐉 龍の力
          </div>
        </div>
      )}

      {/* 20. RETRO SYNTHWAVE */}
      {effect === 'synthwave' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-600/10 to-indigo-950/40" />
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-pink-500/20 via-orange-500/10 to-transparent blur-md" />
          <div
            className="absolute bottom-0 inset-x-0 h-20 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(236,72,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 8px',
              perspective: '150px',
              transform: 'rotateX(40deg)',
              transformOrigin: 'bottom',
            }}
          />
        </div>
      )}

      {/* 21. FROST BLIZZARD */}
      {effect === 'frost-blizzard' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-blue-900/10 to-cyan-950/20" />
          <div className="absolute inset-0 border border-sky-300/30 shadow-[inset_0_0_15px_rgba(56,189,248,0.25)]" />
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute text-sky-200 select-none animate-snow-fall opacity-85 text-xs"
              style={{
                left: `${(i * 8 + 3) % 98}%`,
                top: `-${15 + (i * 7)}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3.5 + (i % 3)}s`,
                filter: 'drop-shadow(0 0 6px #38bdf8)',
              }}
            >
              ❄️
            </span>
          ))}
        </div>
      )}

      {/* 22. MAGIC PORTAL */}
      {effect === 'magic-portal' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-purple-900/20 to-transparent" />
          <div className="absolute inset-0 border border-indigo-500/40 shadow-[inset_0_0_25px_rgba(99,102,241,0.3)] animate-pulse-glow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-dashed border-indigo-400/40 animate-spin-slow" />
          {['🔮', '✦', '⭐', '✦'].map((sym, i) => (
            <span
              key={i}
              className="absolute select-none animate-twinkle text-xs drop-shadow-[0_0_8px_#818cf8]"
              style={{
                left: `${20 + i * 22}%`,
                top: `${25 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {sym}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
