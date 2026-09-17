export type CatalogCategory = 'all' | 'cyber' | 'retro' | 'luxury' | 'kawaii' | 'dark' | 'cosmic';

export interface CatalogCategoryOption {
  id: CatalogCategory;
  name: string;
  icon: string;
}

export const CATALOG_CATEGORIES: CatalogCategoryOption[] = [
  { id: 'all', name: 'Tout afficher', icon: '✨' },
  { id: 'cyber', name: 'Cyber & Sci-Fi', icon: '⚡' },
  { id: 'retro', name: 'Rétro & Pixel', icon: '👾' },
  { id: 'luxury', name: 'Luxe & Prestige', icon: '👑' },
  { id: 'kawaii', name: 'Kawaii & Anime', icon: '🌸' },
  { id: 'dark', name: 'Dark & Gothique', icon: '🔮' },
  { id: 'cosmic', name: 'Cosmique & Nature', icon: '🌌' },
];

export interface NameFontOption {
  id: string;
  name: string;
  family: string;
  preview: string;
  category: CatalogCategory;
  badge?: string;
}

export const NAME_FONTS: NameFontOption[] = [
  { id: 'default', name: 'Discord Standard', family: 'inherit', preview: 'Discord', category: 'all' },

  // Cyber & Futuriste
  { id: 'orbitron', name: 'Orbitron Cyberpunk', family: "'Orbitron', sans-serif", preview: 'ORBITRON', category: 'cyber', badge: 'Populaire' },
  { id: 'audiowide', name: 'Audiowide Synth', family: "'Audiowide', cursive", preview: 'AUDIOWIDE', category: 'cyber' },
  { id: 'chakra-petch', name: 'Chakra Mecha', family: "'Chakra Petch', sans-serif", preview: 'CHAKRA', category: 'cyber' },
  { id: 'russo-one', name: 'Russo Heavy Tech', family: "'Russo One', sans-serif", preview: 'RUSSO', category: 'cyber' },
  { id: 'michroma', name: 'Michroma HUD', family: "'Michroma', sans-serif", preview: 'MICHROMA', category: 'cyber' },
  { id: 'exo-2', name: 'Exo 2 High-Tech', family: "'Exo 2', sans-serif", preview: 'EXO 2.0', category: 'cyber' },
  { id: 'jetbrains', name: 'JetBrains Hacker', family: "'JetBrains Mono', monospace", preview: 'const bot = true;', category: 'cyber' },

  // Rétro & Pixel
  { id: 'press-start', name: 'Press Start 8-Bit', family: "'Press Start 2P', monospace", preview: '8-BIT RETRO', category: 'retro', badge: 'Nostalgie' },
  { id: 'silkscreen', name: 'Silkscreen GameBoy', family: "'Silkscreen', monospace", preview: 'PIXEL ART', category: 'retro' },
  { id: 'vt323', name: 'VT323 Terminal CRT', family: "'VT323', monospace", preview: 'ROOT@SYSTEM:~$', category: 'retro' },
  { id: 'bungee', name: 'Bungee Arcade', family: "'Bungee', cursive", preview: 'BUNGEE', category: 'retro' },
  { id: 'black-ops', name: 'Black Ops Tactique', family: "'Black Ops One', cursive", preview: 'BLACK OPS', category: 'retro' },
  { id: 'righteous', name: 'Righteous 80s', family: "'Righteous', cursive", preview: 'SYNTHWAVE', category: 'retro' },

  // Luxe & Prestige
  { id: 'playfair', name: 'Playfair Haute Couture', family: "'Playfair Display', serif", preview: 'Prestige Élégance', category: 'luxury', badge: 'VIP' },
  { id: 'cinzel', name: 'Cinzel Empereur', family: "'Cinzel', serif", preview: 'CINZEL IMPERIAL', category: 'luxury' },
  { id: 'cormorant', name: 'Cormorant Aristocratie', family: "'Cormorant Garamond', serif", preview: 'Aristocrate', category: 'luxury' },
  { id: 'prata', name: 'Prata Vogue Minimal', family: "'Prata', serif", preview: 'Vogue Luxe', category: 'luxury' },
  { id: 'unifraktur', name: 'Gothique Médiéval', family: "'UnifrakturMaguntia', cursive", preview: 'Olde English', category: 'luxury' },

  // Kawaii & Calligraphie
  { id: 'pacifico', name: 'Pacifico Pop Art', family: "'Pacifico', cursive", preview: 'Kawaii Pop', category: 'kawaii', badge: 'Cute' },
  { id: 'caveat', name: 'Caveat Signature', family: "'Caveat', cursive", preview: 'Signature Fluide', category: 'kawaii' },
  { id: 'dancing-script', name: 'Dancing Calligraphie', family: "'Dancing Script', cursive", preview: 'Dancing Script', category: 'kawaii' },
  { id: 'great-vibes', name: 'Great Vibes Cérémonie', family: "'Great Vibes', cursive", preview: 'Great Vibes', category: 'kawaii' },

  // Dark & Gothique
  { id: 'rubik-glitch', name: 'Rubik Glitch Bug', family: "'Rubik Glitch', cursive", preview: 'G̸L̵I̷T̵C̸H̸', category: 'dark', badge: 'Nouveau' },
  { id: 'nosifer', name: 'Nosifer Sanglot', family: "'Nosifer', cursive", preview: 'BLOOD RUNES', category: 'dark' },
  { id: 'creepster', name: 'Creepster Horreur', family: "'Creepster', cursive", preview: 'CREEPY NIGHT', category: 'dark' },
  { id: 'rock-salt', name: 'Rock Salt Grunge', family: "'Rock Salt', cursive", preview: 'RAW GRUNGE', category: 'dark' },
  { id: 'permanent-marker', name: 'Permanent Marker Tag', family: "'Permanent Marker', cursive", preview: 'GRAFFITI TAG', category: 'dark' },

  // Impact & Moderne
  { id: 'bebas-neue', name: 'Bebas Blockbuster', family: "'Bebas Neue', sans-serif", preview: 'BEBAS IMPACT', category: 'cosmic' },
  { id: 'syne', name: 'Syne Avant-Garde', family: "'Syne', sans-serif", preview: 'SYNE DESIGNER', category: 'cosmic' },
  { id: 'monoton', name: 'Monoton Disco Lines', family: "'Monoton', cursive", preview: 'MONOTON', category: 'cosmic' },
];

export function getFontFamily(fontId?: string): string {
  const match = NAME_FONTS.find((f) => f.id === fontId);
  return match ? match.family : 'inherit';
}

export interface GradientOption {
  id: string;
  name: string;
  gradient: string;
  category: CatalogCategory;
}

export const BANNER_GRADIENTS: GradientOption[] = [
  // Cyber
  { id: 'cyberpunk', name: 'Cyberpunk Neon', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)', category: 'cyber' },
  { id: 'electric-blue', name: 'Electric Cyan Pulse', gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', category: 'cyber' },
  { id: 'matrix-green', name: 'Matrix Digital Grid', gradient: 'linear-gradient(135deg, #000000 0%, #0d2818 40%, #16a34a 100%)', category: 'cyber' },
  { id: 'synth-highway', name: 'Synth Highway Sunset', gradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #3a0ca3 100%)', category: 'cyber' },

  // Cosmique
  { id: 'cosmic', name: 'Cosmic Violet Nebula', gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)', category: 'cosmic' },
  { id: 'deepspace', name: 'Deep Space Abyss', gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', category: 'cosmic' },
  { id: 'aurora', name: 'Emerald Aurora Borealis', gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)', category: 'cosmic' },
  { id: 'supernova', name: 'Prismatic Supernova', gradient: 'linear-gradient(135deg, #ff007f 0%, #7928ca 50%, #00dfd8 100%)', category: 'cosmic' },

  // Dark & Gothique
  { id: 'midnight', name: 'Midnight Eclipse', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)', category: 'dark' },
  { id: 'bloodmoon', name: 'Blood Moon Crimson', gradient: 'linear-gradient(135deg, #2b0303 0%, #7f1d1d 50%, #dc2626 100%)', category: 'dark' },
  { id: 'void-dark', name: 'Abyssal Void Purple', gradient: 'linear-gradient(135deg, #18002e 0%, #3c096c 50%, #5a189a 100%)', category: 'dark' },
  { id: 'obsidian', name: 'Obsidian Black Gold', gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #4b5563 100%)', category: 'dark' },

  // Luxe & Royal
  { id: 'gold', name: 'Golden Royal Luxury', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 100%)', category: 'luxury' },
  { id: 'champagne', name: 'Champagne Diamond', gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #ca8a04 100%)', category: 'luxury' },
  { id: 'sapphire', name: 'Imperial Sapphire', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)', category: 'luxury' },
  { id: 'amethyst', name: 'Amethyst Royale', gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)', category: 'luxury' },

  // Kawaii & Anime
  { id: 'sakura', name: 'Cherry Blossom Pastel', gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fbcfe8 100%)', category: 'kawaii' },
  { id: 'candy', name: 'Candy Cotton Fluff', gradient: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #60a5fa 100%)', category: 'kawaii' },
  { id: 'sunset', name: 'Tokyo Sunset Blaze', gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)', category: 'kawaii' },
  { id: 'peachy', name: 'Sweet Peach Melba', gradient: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fde047 100%)', category: 'kawaii' },

  // Rétro
  { id: 'toxic', name: 'Toxic Acid Lime', gradient: 'linear-gradient(135deg, #84cc16 0%, #10b981 50%, #064e3b 100%)', category: 'retro' },
  { id: 'arcade-90s', name: 'Arcade 1990 Neon', gradient: 'linear-gradient(135deg, #f43f5e 0%, #eab308 50%, #3b82f6 100%)', category: 'retro' },
  { id: 'vaporwave', name: 'Vaporwave Sunset Glow', gradient: 'linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%)', category: 'retro' },
  { id: 'fire-inferno', name: 'Inferno Magma Fire', gradient: 'linear-gradient(135deg, #7f1d1d 0%, #ea580c 50%, #facc15 100%)', category: 'retro' },
];

export interface BannerPreset {
  id: string;
  name: string;
  url: string;
  isGif?: boolean;
  category: CatalogCategory;
}

export const BANNER_PRESETS: BannerPreset[] = [
  // Cyber GIFs & Images
  {
    id: 'b_cyber_city_gif',
    name: 'Cyber City Rain (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNndic2pxNGs3anRmb2k3OXczYmtiaDN1aGJ0MnRpdTVrZ2V1Ymg5NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgzoKnwFNmISR8I/giphy.gif',
    isGif: true,
    category: 'cyber',
  },
  {
    id: 'b_synthwave_highway_gif',
    name: 'Synthwave Highway (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZmdHpnZTFsdmVscTJ2NDF0b3VxcTgyNHNldGN0Mmt5dmF4azZ6NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d1E2VyhFsxawRfZ6/giphy.gif',
    isGif: true,
    category: 'cyber',
  },
  {
    id: 'b_neon_cyber_grid',
    name: 'Neon Cyber Alley',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'cyber',
  },

  // Cosmique GIFs & Images
  {
    id: 'b_galaxy_space_gif',
    name: 'Galaxy Stars Nebula (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIyb2ZtZjh3ZTFmb215YmVvbnlybWJqcjhvNGY1cjRjcDR1eWR1MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif',
    isGif: true,
    category: 'cosmic',
  },
  {
    id: 'b_mountains_aurora',
    name: 'Northern Aurora Night',
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'cosmic',
  },
  {
    id: 'b_starfield_deep',
    name: 'Milky Way Observatory',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'cosmic',
  },

  // Rétro & Pixel
  {
    id: 'b_pixel_waterfall_gif',
    name: 'Pixel Waterfall (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3NkaG5oZnlyZ3VvaXV3N2p6cW16Znl3d3dzMWRnODR6MXB2OHZqaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LMcB8XEXEnbmg11mCD/giphy.gif',
    isGif: true,
    category: 'retro',
  },
  {
    id: 'b_pixel_city_sunset_gif',
    name: 'Pixel Dusk Skyline (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGh1aHRiZW5qYmJxbjdxOHhnb3QxZ2k2cDB3Nnh3d3N0MW53N3VwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKTDnUxE0gpn344/giphy.gif',
    isGif: true,
    category: 'retro',
  },

  // Kawaii & Anime
  {
    id: 'b_anime_sky',
    name: 'Anime Sunset Clouds',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'kawaii',
  },
  {
    id: 'b_sakura_tree',
    name: 'Spring Blossom Garden',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'kawaii',
  },

  // Dark & Gothique
  {
    id: 'b_dark_minimal',
    name: 'Dark Liquid Obsidian',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'dark',
  },
  {
    id: 'b_smoke_nebula',
    name: 'Mystic Purple Fog',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'dark',
  },
];

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  isGif?: boolean;
  category: CatalogCategory;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  // GIFs Animés
  {
    id: 'av_cat_neon_gif',
    name: 'Neon Cat Party (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmOHF2d3JzZXQ4ODN2a3R6cHF3aGN6dHpyOHl6eTB5Z3QyeXNvayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif',
    isGif: true,
    category: 'kawaii',
  },
  {
    id: 'av_pixel_heart_gif',
    name: 'Pixel Heart Beat (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHdpMzZ0eHpja3N1YWl4ZnpxNGNiaXRyZ2Nsc2NseWRscG53aWNuNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlOBZRezgkftKVG/giphy.gif',
    isGif: true,
    category: 'retro',
  },
  {
    id: 'av_cyber_pulse_gif',
    name: 'Cyber Wave Pulse (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjhtdzNuZnVsdnlqbnNpcjFpM3FwMm9tNXphZ204bzBhMXQxODg5MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKTDnUxE0gpn344/giphy.gif',
    isGif: true,
    category: 'cyber',
  },
  {
    id: 'av_gaming_controller_gif',
    name: 'Retro Gamepad Glow (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTJwNXBscWF3d2pxc2drZTRudXlyYzl2cXo1eHhtOHo2enRwb2FkcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abAHdYvZdBNnAOI/giphy.gif',
    isGif: true,
    category: 'retro',
  },
  {
    id: 'av_cosmic_space_cat_gif',
    name: 'Cosmic Floating (GIF)',
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnd3bXdpMmQ2MmdqZXB1Mmkyb210Z2h5a3VscHFjOGg2OXNqamJjayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5Pncu88nBdLgc/giphy.gif',
    isGif: true,
    category: 'cosmic',
  },

  // Avatars Stylés Haute Définition
  {
    id: 'av_cyberpunk_girl',
    name: 'Cyberpunk Aesthetic',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'cyber',
  },
  {
    id: 'av_hacker_avatar',
    name: 'Dev Gamer Neon',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'cyber',
  },
  {
    id: 'av_sakura_girl',
    name: 'Sakura Pastel Girl',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'kawaii',
  },
  {
    id: 'av_minimal_artist',
    name: 'Neon Silhouette Artist',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'dark',
  },
  {
    id: 'av_anime_style',
    name: 'Golden Glow Luxury',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'luxury',
  },
  {
    id: 'av_dark_knight',
    name: 'Dark Samurai Assassin',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=250&auto=format&fit=crop&q=80',
    isGif: false,
    category: 'dark',
  },
];

export interface ProfileEffectOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
  category: CatalogCategory;
  badge?: string;
}

export const PROFILE_EFFECTS: ProfileEffectOption[] = [
  { id: 'none', name: 'Aucun effet', description: 'Profil standard Discord', icon: '⚪', badgeColor: '#949ba4', category: 'all' },

  // Cyber & Sci-Fi
  { id: 'cyberpunk', name: 'Cyberpunk 2077', description: 'Scanlines holographiques, grille néon cyan/magenta & alertes HUD', icon: '⚡', badgeColor: '#06b6d4', category: 'cyber', badge: 'Populaire' },
  { id: 'matrix', name: 'Pluie Matrix Hacker', description: 'Colonnes de code vert binaire qui tombent du haut', icon: '📟', badgeColor: '#22c55e', category: 'cyber' },
  { id: 'neon-tokyo', name: 'Tokyo Midnight Neon', description: 'Aura néon stroboscopique & traînées de lumière rose/cyan', icon: '🏙️', badgeColor: '#ec4899', category: 'cyber' },
  { id: 'glitch-vhs', name: 'Glitch VHS Vintage', description: 'Bruit parasite vidéo CRT, aberrations chromatiques RGB', icon: '📺', badgeColor: '#f43f5e', category: 'cyber' },

  // Cosmique & Mystique
  { id: 'galaxy', name: 'Galaxie & Étoiles', description: 'Étoiles scintillantes, nébuleuse violette & météores filants', icon: '✨', badgeColor: '#a855f7', category: 'cosmic', badge: 'Top' },
  { id: 'lightning', name: 'Tempête Foudroyante', description: 'Éclairs électriques bleus & décharges haute tension', icon: '⚡', badgeColor: '#3b82f6', category: 'cosmic' },
  { id: 'starlight-supernova', name: 'Supernova Prismatique', description: 'Explosions de poussière prismatique et éclats multicolores', icon: '💫', badgeColor: '#c084fc', category: 'cosmic' },
  { id: 'ocean-abyss', name: 'Océan Abyssal', description: 'Bulles d’air sous-marines montantes & bioluminescence marine', icon: '🫧', badgeColor: '#0ea5e9', category: 'cosmic' },

  // Kawaii & Nature
  { id: 'sakura', name: 'Sakura Petals', description: 'Pétales de cerisiers japonais flottants & brise printanière rose', icon: '🌸', badgeColor: '#f472b6', category: 'kawaii', badge: 'Favori' },
  { id: 'hearts', name: 'Kawaii Magic Hearts', description: 'Cœurs romantiques flottants avec étincelles scintillantes', icon: '💖', badgeColor: '#fb7185', category: 'kawaii' },
  { id: 'butterfly-dream', name: 'Forêt Féerique Papillons', description: 'Papillons enchantés volants & poussière de fée dorée', icon: '🦋', badgeColor: '#a78bfa', category: 'kawaii' },
  { id: 'cherry-sunset', name: 'Coucher de Soleil Momiji', description: 'Feuilles d’érable rouges d’automne tourbillonnantes', icon: '🍁', badgeColor: '#f97316', category: 'kawaii' },

  // Dark & Gothique
  { id: 'fire', name: 'Inferno Solaire Magma', description: 'Flammes ardentes déchaînées & braises incandescentes montantes', icon: '🔥', badgeColor: '#ef4444', category: 'dark', badge: 'Chaud' },
  { id: 'void', name: 'Dark Void Abyss', description: 'Brume spectrale violette ténébreuse & tourbillons d’ombre', icon: '🔮', badgeColor: '#8b5cf6', category: 'dark' },
  { id: 'blood-moon', name: 'Lune de Sang Vampire', description: 'Brume écarlate vampire, chauves-souris & lueur rubis sanglante', icon: '🩸', badgeColor: '#dc2626', category: 'dark' },
  { id: 'toxic', name: 'Déchet Toxique Biohazard', description: 'Fumée radioactif vert fluo & bulles d’acide corrosif', icon: '☣️', badgeColor: '#84cc16', category: 'dark' },

  // Luxe & Royal
  { id: 'gold', name: 'Trésor Royal Doré', description: 'Poussière d’or 24 carats brillante, reflets impériaux & étoiles', icon: '👑', badgeColor: '#eab308', category: 'luxury', badge: 'VIP' },
  { id: 'angelic', name: 'Rayon Céleste Divin', description: 'Plumes blanches angéliques flottantes & rayons de lumière sacrée', icon: '🪶', badgeColor: '#fde047', category: 'luxury' },
  { id: 'dragon-fury', name: 'Fureur du Dragon', description: 'Aura draconique d’or et de flammes sacrées d’Orient', icon: '🐉', badgeColor: '#fbbf24', category: 'luxury' },

  // Rétro & Arcade
  { id: 'synthwave', name: 'Retro Synthwave 80s', description: 'Grille laser en perspective 3D, soleil crépusculaire néon', icon: '🌆', badgeColor: '#ec4899', category: 'retro' },
  { id: 'frost-blizzard', name: 'Blizzard Polaire Givré', description: 'Flocons de neige glacés qui tombent doucement & givre arctique', icon: '❄️', badgeColor: '#38bdf8', category: 'retro' },
  { id: 'magic-portal', name: 'Portail Dimensionnel', description: 'Vortex d’énergie arcanique tournoyant & symboles d’alchimie', icon: '🌀', badgeColor: '#6366f1', category: 'retro' },
];

export interface AvatarDecorationOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: CatalogCategory;
  badge?: string;
}

export const AVATAR_DECORATIONS: AvatarDecorationOption[] = [
  { id: 'none', name: 'Aucun cadre', icon: '🚫', color: '#949ba4', category: 'all' },

  // Cyber & Futuriste
  { id: 'cyber-hex', name: 'Hexagone Cyberpunk', icon: '🤖', color: '#06b6d4', category: 'cyber', badge: 'Néon' },
  { id: 'matrix-ring', name: 'Anneau Binaire Hacker', icon: '💻', color: '#22c55e', category: 'cyber' },
  { id: 'neon-cat-ears', name: 'Oreilles Cyber Neko', icon: '🐱', color: '#f43f5e', category: 'cyber' },
  { id: 'thunder-storm', name: 'Arc Foudroyant Électrique', icon: '⚡', color: '#38bdf8', category: 'cyber' },

  // Dark & Gothique
  { id: 'flame-ring', name: 'Cercle de Feu Ardent', icon: '🔥', color: '#ef4444', category: 'dark', badge: 'Populaire' },
  { id: 'devil-horns', name: 'Cornes Démoniaques', icon: '😈', color: '#dc2626', category: 'dark' },
  { id: 'blood-vampire', name: 'Ailes de Chauve-Souris', icon: '🦇', color: '#991b1b', category: 'dark' },
  { id: 'demon-slayer', name: 'Aura Flamme Ténébreuse', icon: '⚔️', color: '#7c3aed', category: 'dark' },
  { id: 'radioactive', name: 'Anneau Toxique Biohazard', icon: '☣️', color: '#84cc16', category: 'dark' },

  // Kawaii & Anime
  { id: 'sakura-crown', name: 'Couronne Sakura Florale', icon: '🌸', color: '#f472b6', category: 'kawaii', badge: 'Cute' },
  { id: 'kawaii-bunny', name: 'Oreilles de Lapin Rose', icon: '🐰', color: '#fb7185', category: 'kawaii' },
  { id: 'sparkle-star', name: 'Constellation Magique', icon: '⭐', color: '#eab308', category: 'kawaii' },
  { id: 'bubble-aquatic', name: 'Perles & Bulles Océan', icon: '🫧', color: '#38bdf8', category: 'kawaii' },

  // Luxe & Royal
  { id: 'golden-laurel', name: 'Couronne de Laurier d’Or', icon: '👑', color: '#f59e0b', category: 'luxury', badge: 'VIP' },
  { id: 'angel-wings', name: 'Ailes Célestes & Halo', icon: '👼', color: '#fbbf24', category: 'luxury' },
  { id: 'holy-halo', name: 'Halo Céleste Rayonnant', icon: '✨', color: '#fde047', category: 'luxury' },
  { id: 'dragon-horns', name: 'Cornes de Dragon Ancien', icon: '🐉', color: '#ea580c', category: 'luxury' },

  // Rétro & Pixel
  { id: 'pixel-crown', name: 'Couronne Pixel 8-Bit', icon: '👾', color: '#fbbf24', category: 'retro', badge: '8-Bit' },
  { id: 'rainbow-spin', name: 'Halo Arc-en-Ciel Chromatique', icon: '🌈', color: '#a855f7', category: 'retro' },
  { id: 'synthwave-sun', name: 'Soleil Couchant Synthwave', icon: '🌅', color: '#ec4899', category: 'retro' },
  { id: 'ice-crystal', name: 'Couronne de Givre Polaire', icon: '❄️', color: '#7dd3fc', category: 'retro' },
  { id: 'magic-runes', name: 'Cercle Runique Arcanique', icon: '🔮', color: '#c084fc', category: 'retro' },
  { id: 'space-orbit', name: 'Orbite Satellite & Planète', icon: '🪐', color: '#818cf8', category: 'retro' },
];

export interface NameColorOption {
  id: string;
  name: string;
  value: string;
  isGradient?: boolean;
}

export const PRESET_NAME_COLORS: NameColorOption[] = [
  { id: 'default', name: 'Blanc Classique', value: '#ffffff' },
  { id: 'blurple', name: 'Discord Blurple', value: '#5865f2' },
  { id: 'green', name: 'Vert Émeraude', value: '#23a55a' },
  { id: 'yellow', name: 'Jaune Or Solaire', value: '#f0b232' },
  { id: 'red', name: 'Rouge Sang Rubis', value: '#f23f43' },
  { id: 'pink', name: 'Rose Bonbon Néon', value: '#eb459e' },
  { id: 'cyan', name: 'Cyan Électrique', value: '#00b0f4' },
  { id: 'lime', name: 'Lime Toxique Fluo', value: '#57f287' },
  { id: 'purple', name: 'Violet Sombre Royal', value: '#9b59b6' },
  { id: 'orange', name: 'Orange Braise', value: '#e67e22' },
  { id: 'ice', name: 'Bleu Givre Glacé', value: '#7dd3fc' },
  { id: 'gold-solid', name: 'Or Impérial Pur', value: '#fbbf24' },

  // Gradients de texte exclusifs
  { id: 'rainbow-text', name: 'Dégradé Arc-en-ciel Holo', value: 'linear-gradient(90deg, #ff007f, #7928ca, #00dfd8)', isGradient: true },
  { id: 'sunset-text', name: 'Dégradé Sunset Fire', value: 'linear-gradient(90deg, #f97316, #ef4444, #ec4899)', isGradient: true },
  { id: 'cyber-text', name: 'Dégradé Cyber Neon', value: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)', isGradient: true },
  { id: 'gold-text', name: 'Dégradé Or Luxueux', value: 'linear-gradient(90deg, #fde047, #f59e0b, #d97706)', isGradient: true },
  { id: 'toxic-text', name: 'Dégradé Toxique Acid', value: 'linear-gradient(90deg, #84cc16, #10b981, #064e3b)', isGradient: true },
  { id: 'galaxy-text', name: 'Dégradé Galaxie Stellaire', value: 'linear-gradient(90deg, #c084fc, #ec4899, #f43f5e)', isGradient: true },
];
