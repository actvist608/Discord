import { Server, User, Message, FriendRelation, DirectMessageConversation } from '../types';

// Auth persistence helpers
export function getStoredAuthUser(): User | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('discord_auth_user') || localStorage.getItem('discord_user_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export function saveAuthUser(user: User): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('discord_auth_user', JSON.stringify(user));
      localStorage.setItem('discord_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }
}

export function clearAuthUser(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('discord_auth_user');
      localStorage.removeItem('discord_user_profile');
    } catch (e) {
      console.error(e);
    }
  }
}

// Helper to generate or load persistent local user
export function getOrCreateLocalUser(): User {
  const existing = getStoredAuthUser();
  if (existing) return existing;

  // Create clean initial user
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const defaultUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: `naskass_${randomNum.toString().slice(0, 2)}`,
    displayName: 'Naskass',
    discriminator: randomNum.toString(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bannerColor: '#5865F2',
    bannerUrl: '',
    pronouns: 'il/lui',
    status: 'online',
    customStatus: 'En ligne sur Discord ⚡',
    badges: ['nitro', 'developer'],
    bio: 'Bienvenue sur mon profil Discord ! Vous pouvez personnaliser votre nom, avatar, bannière et bio dans les Paramètres.',
    joinedDiscord: 'Aujourd\'hui',
    color: '#5865F2',
  };

  saveAuthUser(defaultUser);
  return defaultUser;
}

export const INITIAL_SERVERS: Server[] = [
  {
    id: 'srv_main',
    name: 'Serveur Communautaire',
    acronym: 'SC',
    icon: undefined,
    description: 'Le serveur en direct où tous les participants peuvent chatter et partager.',
    ownerId: 'system',
    roles: [
      { id: 'role_admin', name: '👑 Admin', color: '#E74C3C', hoist: true },
      { id: 'role_member', name: 'Membres', color: '#3498DB' },
    ],
    members: [],
    categories: [
      {
        id: 'cat_text',
        name: '💬 SALONS TEXTUELS',
        channels: [
          {
            id: 'chan_general',
            name: 'général',
            type: 'text',
            topic: 'Salon général — Discutez en direct avec tous ceux qui ouvrent ce lien !',
          },
          {
            id: 'chan_tech',
            name: 'tech-et-code',
            type: 'text',
            topic: 'Entraide, code, astuces et discussions techniques.',
          },
          {
            id: 'chan_medias',
            name: 'photos-et-medias',
            type: 'text',
            topic: 'Partagez vos images, fichiers et liens.',
          },
        ],
      },
      {
        id: 'cat_voice',
        name: '🔊 SALONS VOCAUX',
        channels: [
          {
            id: 'chan_voice_1',
            name: 'Salon Vocal 1',
            type: 'voice',
            connectedUsers: [],
          },
          {
            id: 'chan_voice_2',
            name: 'Salon Vocal 2',
            type: 'voice',
            connectedUsers: [],
          },
        ],
      },
    ],
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chan_general: [
    {
      id: 'msg_welcome',
      channelId: 'chan_general',
      authorId: 'system',
      content: '👋 **Bienvenue sur Discord en direct !**\nToute personne qui ouvre ce même lien arrive sur ce serveur et peut discuter en temps réel avec vous. Ouvrez un deuxième onglet ou partagez le lien pour tester la discussion en simultané !\n\n💡 *Cliquez sur la roue crantée en bas à gauche pour personnaliser votre profil à 100% (avatar, pseudo, bannière, bio).*',
      timestamp: 'Aujourd\'hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: true,
      reactions: [{ emoji: '🎉', count: 1, users: ['system'] }],
    },
  ],
};

export const SYSTEM_USER: User = {
  id: 'system',
  username: 'system',
  displayName: 'Discord Bot',
  discriminator: '0000',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  bannerColor: '#5865F2',
  status: 'online',
  customStatus: 'Bot officiel 🤖',
  badges: ['developer'],
  bio: 'Bot officiel du serveur en temps réel.',
  joinedDiscord: 'Toujours',
  color: '#5865F2',
};

export const EMOJI_LIST = [
  '😀', '😂', '🤣', '😍', '😎', '🥳', '🤔', '🙌',
  '🔥', '🎉', '🚀', '💯', '✨', '⚡', '❤️', '💜',
  '👍', '👋', '👀', '🎮', '🎧', '💻', '💡', '🏆',
];

export const GIF_LIST = [
  { title: 'Discord Dance', url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif' },
  { title: 'Popcorn', url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif' },
  { title: 'Gaming Win', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif' },
  { title: 'Cat Jam', url: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
  { title: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
  { title: 'Cheers', url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif' },
];

