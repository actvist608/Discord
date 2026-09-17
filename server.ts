import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Uploaded Files Storage (accessible by all users via /api/files/:fileId)
interface StoredFile {
  buffer: Buffer;
  mimeType: string;
  name: string;
  size: number;
}
const uploadedFiles = new Map<string, StoredFile>();

// In-Memory Data Store (shared across all users who open the link)
interface Role {
  id: string;
  name: string;
  color: string;
  hoist?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  topic?: string;
  connectedUsers?: string[];
}

interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
}

interface ServerData {
  id: string;
  name: string;
  icon?: string;
  acronym: string;
  banner?: string;
  description?: string;
  ownerId: string;
  categories: ChannelCategory[];
  roles: Role[];
  members: string[];
  memberRoles?: Record<string, string[]>;
  inviteCode?: string;
}

interface AccountRecord {
  id: string;
  username: string;
  displayName: string;
  discriminator: string;
  email?: string;
  password: string;
  avatar: string;
  bannerColor?: string;
  bannerGradient?: string;
  bannerUrl?: string;
  pronouns?: string;
  bio: string;
  badges: string[];
  joinedDiscord: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  color?: string;
  avatarDecoration?: string;
  profileEffect?: string;
  nameFont?: string;
  nameColor?: string;
  themeColors?: [string, string];
}

interface UserData {
  id: string;
  username: string;
  displayName: string;
  discriminator?: string;
  avatar: string;
  bannerColor?: string;
  bannerGradient?: string;
  bannerUrl?: string;
  pronouns?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  badges: string[];
  bio: string;
  joinedDiscord: string;
  color?: string;
  lastSeen?: number;
  avatarDecoration?: string;
  profileEffect?: string;
  nameFont?: string;
  nameColor?: string;
  themeColors?: [string, string];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  isImage?: boolean;
}

interface MessageData {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  pinned?: boolean;
  replyToId?: string;
  attachments?: Attachment[];
  reactions: Reaction[];
}

// Registered accounts store
const registeredAccounts: Map<string, AccountRecord> = new Map([
  [
    'user_naskass',
    {
      id: 'user_naskass',
      username: 'naskass',
      displayName: 'Naskass',
      discriminator: '1337',
      email: 'naskass@discord.app',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bannerColor: '#5865F2',
      bannerUrl: '',
      pronouns: 'il/lui',
      bio: 'Créateur du serveur ! Bienvenue à tous sur Discord en direct.',
      badges: ['nitro', 'developer'],
      joinedDiscord: 'Aujourd\'hui',
      status: 'offline',
      customStatus: 'En ligne sur Discord ⚡',
      color: '#5865F2',
    },
  ],
  [
    'user_alex',
    {
      id: 'user_alex',
      username: 'alex',
      displayName: 'Alexandre',
      discriminator: '4040',
      email: 'alex@discord.app',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bannerColor: '#23A55A',
      bannerUrl: '',
      pronouns: 'il/lui',
      bio: 'Passionné de jeux vidéo et de tech. N\'hésitez pas à m\'envoyer un message !',
      badges: ['hypesquad_bravery'],
      joinedDiscord: 'Hier',
      status: 'offline',
      customStatus: 'Prêt à jouer 🎮',
      color: '#23A55A',
    },
  ],
  [
    'user_clara',
    {
      id: 'user_clara',
      username: 'clara',
      displayName: 'Clara ✨',
      discriminator: '2026',
      email: 'clara@discord.app',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bannerColor: '#EB459E',
      bannerUrl: '',
      pronouns: 'elle',
      bio: 'Design & Musique 🎧 Bienvenue sur le salon !',
      badges: ['nitro', 'booster'],
      joinedDiscord: 'Cette semaine',
      status: 'offline',
      customStatus: 'Écoute de la bonne musique 🎵',
      color: '#EB459E',
    },
  ],
]);

// Populate initial users map and server members
const users: Map<string, UserData> = new Map();
registeredAccounts.forEach((acc) => {
  const { password, email, ...userData } = acc;
  users.set(acc.id, userData);
});

// Default Clean Server (no fake bots or mock users)
const servers: ServerData[] = [
  {
    id: 'srv_main',
    name: 'Serveur Général',
    acronym: 'SG',
    icon: undefined,
    description: 'Le serveur en direct partagé pour tous ceux qui ouvrent cette application.',
    ownerId: 'user_naskass',
    roles: [
      { id: 'role_admin', name: '👑 Admin', color: '#E74C3C', hoist: true },
      { id: 'role_mod', name: '🛡️ Modérateur', color: '#2ECC71', hoist: true },
      { id: 'role_vip', name: '⭐ VIP', color: '#F1C40F', hoist: true },
      { id: 'role_member', name: 'Membres', color: '#3498DB' },
    ],
    members: Array.from(registeredAccounts.keys()),
    memberRoles: {
      user_naskass: ['role_admin'],
      user_alex: ['role_mod'],
      user_clara: ['role_vip'],
    },
    inviteCode: 'SG-2026',
    categories: [
      {
        id: 'cat_text',
        name: '💬 SALONS TEXTUELS',
        channels: [
          {
            id: 'chan_general',
            name: 'général',
            type: 'text',
            topic: 'Bienvenue ! Discutez en temps réel avec tous ceux qui ont le lien.',
          },
          {
            id: 'chan_tech',
            name: 'tech-et-code',
            type: 'text',
            topic: 'Discussions autour du développement, partage de code et snippets.',
          },
          {
            id: 'chan_medias',
            name: 'partage-et-images',
            type: 'text',
            topic: 'Partagez des captures, des GIFs et des pièces jointes.',
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

const messages: Record<string, MessageData[]> = {
  chan_general: [
    {
      id: 'msg_welcome',
      channelId: 'chan_general',
      authorId: 'system',
      content: '👋 **Bienvenue sur Discord !**\nToute personne qui ouvre ce même lien arrive ici et peut chatter en direct avec vous en temps réel. Vous pouvez également modifier votre profil dans les Paramètres (roue crantée en bas à gauche) !',
      timestamp: 'Aujourd\'hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: true,
      reactions: [{ emoji: '🎉', count: 1, users: ['system'] }],
    },
  ],
};

// WebSocket Connection Tracking
const clients = new Map<WebSocket, { userId?: string }>();

const wss = new WebSocketServer({ server });

function broadcast(payload: object, excludeWs?: WebSocket) {
  const data = JSON.stringify(payload);
  for (const [client] of clients.entries()) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', (ws) => {
  clients.set(ws, {});

  // Send initial bootstrap payload on connect
  ws.send(
    JSON.stringify({
      type: 'bootstrap',
      data: {
        servers,
        messages,
        users: Array.from(users.values()),
      },
    })
  );

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      const type = msg.type;
      const clientInfo = clients.get(ws) || {};

      switch (type) {
        case 'identify': {
          const user: UserData = msg.user;
          if (user && user.id) {
            clientInfo.userId = user.id;
            user.status = user.status || 'online';
            user.lastSeen = Date.now();
            users.set(user.id, user);

            // Add user to main server member list if not present
            if (!servers[0].members.includes(user.id)) {
              servers[0].members.push(user.id);
            }

            // Broadcast updated presence
            broadcast({
              type: 'presence:update',
              users: Array.from(users.values()),
              serverMembers: servers[0].members,
            });
          }
          break;
        }

        case 'profile:update': {
          const updatedUser: UserData = msg.user;
          if (updatedUser && updatedUser.id) {
            users.set(updatedUser.id, updatedUser);
            for (const acc of registeredAccounts.values()) {
              if (acc.id === updatedUser.id) {
                Object.assign(acc, updatedUser);
                break;
              }
            }
            broadcast({
              type: 'user:updated',
              user: updatedUser,
            });
          }
          break;
        }

        case 'message:send': {
          const { id, channelId, content, authorId, replyToId, attachments } = msg;
          if (!channelId) return;

          const hasAttachments = attachments && Array.isArray(attachments) && attachments.length > 0;
          const cleanContent = typeof content === 'string' ? content.trim() : '';

          // Message must have either text content or at least one attachment
          if (!cleanContent && !hasAttachments) return;

          const author = users.get(authorId);
          const messageId = id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

          const newMsg: MessageData = {
            id: messageId,
            channelId,
            authorId,
            content: cleanContent,
            timestamp: 'Aujourd\'hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyToId,
            attachments: hasAttachments ? attachments : undefined,
            reactions: [],
          };

          if (!messages[channelId]) {
            messages[channelId] = [];
          }
          if (!messages[channelId].some((m) => m.id === messageId)) {
            messages[channelId].push(newMsg);
          }

          // Broadcast to other clients (exclude sender client ws to prevent double rendering)
          broadcast(
            {
              type: 'message:new',
              message: newMsg,
              author: author || undefined,
            },
            ws
          );
          break;
        }

        case 'message:react': {
          const { messageId, channelId, emoji, userId } = msg;
          const channelMsgs = messages[channelId] || [];
          const targetMsg = channelMsgs.find((m) => m.id === messageId);

          if (targetMsg) {
            const existingReaction = targetMsg.reactions.find((r) => r.emoji === emoji);
            if (existingReaction) {
              if (existingReaction.users.includes(userId)) {
                existingReaction.users = existingReaction.users.filter((u) => u !== userId);
                existingReaction.count = existingReaction.users.length;
                if (existingReaction.count === 0) {
                  targetMsg.reactions = targetMsg.reactions.filter((r) => r.emoji !== emoji);
                }
              } else {
                existingReaction.users.push(userId);
                existingReaction.count = existingReaction.users.length;
              }
            } else {
              targetMsg.reactions.push({ emoji, count: 1, users: [userId] });
            }

            broadcast({
              type: 'message:reaction',
              messageId,
              channelId,
              reactions: targetMsg.reactions,
            });
          }
          break;
        }

        case 'message:delete': {
          const { messageId, channelId } = msg;
          if (messages[channelId]) {
            messages[channelId] = messages[channelId].filter((m) => m.id !== messageId);
            broadcast({
              type: 'message:deleted',
              messageId,
              channelId,
            });
          }
          break;
        }

        case 'message:pin': {
          const { messageId, channelId } = msg;
          const targetMsg = messages[channelId]?.find((m) => m.id === messageId);
          if (targetMsg) {
            targetMsg.pinned = !targetMsg.pinned;
            broadcast({
              type: 'message:pinned',
              messageId,
              channelId,
              pinned: targetMsg.pinned,
            });
          }
          break;
        }

        case 'typing:status': {
          const { channelId, user, isTyping } = msg;
          broadcast(
            {
              type: 'typing:status',
              channelId,
              user,
              isTyping,
            },
            ws
          );
          break;
        }

        case 'voice:join': {
          const { channelId, userId } = msg;
          // Find channel in all servers
          for (const srv of servers) {
            for (const cat of srv.categories) {
              for (const ch of cat.channels) {
                if (ch.type === 'voice') {
                  if (ch.id === channelId) {
                    ch.connectedUsers = ch.connectedUsers || [];
                    if (!ch.connectedUsers.includes(userId)) {
                      ch.connectedUsers.push(userId);
                    }
                  } else {
                    // Remove from any other voice channel
                    ch.connectedUsers = ch.connectedUsers?.filter((u) => u !== userId);
                  }
                }
              }
            }
          }

          broadcast({
            type: 'voice:update',
            servers,
          });
          break;
        }

        case 'voice:leave': {
          const { userId } = msg;
          for (const srv of servers) {
            for (const cat of srv.categories) {
              for (const ch of cat.channels) {
                if (ch.type === 'voice') {
                  ch.connectedUsers = ch.connectedUsers?.filter((u) => u !== userId);
                }
              }
            }
          }

          broadcast({
            type: 'voice:update',
            servers,
          });
          break;
        }

        case 'channel:create': {
          const { serverId, name, channelType, categoryId } = msg;
          const srv = servers.find((s) => s.id === serverId);
          if (srv) {
            const newChan: Channel = {
              id: `chan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name,
              type: channelType,
              topic: channelType === 'text' ? `Bienvenue dans #${name}` : undefined,
              connectedUsers: channelType === 'voice' ? [] : undefined,
            };

            const cat = srv.categories.find((c) => c.id === categoryId) || srv.categories[0];
            cat.channels.push(newChan);

            broadcast({
              type: 'channel:created',
              serverId,
              categoryId: cat.id,
              channel: newChan,
            });
          }
          break;
        }

        case 'server:create': {
          const { name, icon, ownerId } = msg;
          const cleanName = name || 'Nouveau Serveur';
          const newSrv: ServerData = {
            id: `srv_${Date.now()}`,
            name: cleanName,
            icon,
            acronym: cleanName
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 3)
              .toUpperCase() || 'SRV',
            ownerId,
            roles: [
              { id: 'role_admin', name: '👑 Admin', color: '#E74C3C', hoist: true },
              { id: 'role_member', name: 'Membres', color: '#3498DB' },
            ],
            members: [ownerId],
            memberRoles: {
              [ownerId]: ['role_admin'],
            },
            inviteCode: `inv-${Math.random().toString(36).substring(2, 7)}`,
            categories: [
              {
                id: `cat_${Date.now()}_1`,
                name: '💬 SALONS TEXTUELS',
                channels: [
                  {
                    id: `chan_${Date.now()}_gen`,
                    name: 'général',
                    type: 'text',
                    topic: 'Bienvenue sur le nouveau serveur !',
                  },
                ],
              },
              {
                id: `cat_${Date.now()}_2`,
                name: '🔊 SALONS VOCAUX',
                channels: [
                  {
                    id: `chan_${Date.now()}_voc`,
                    name: 'Salon Vocal',
                    type: 'voice',
                    connectedUsers: [],
                  },
                ],
              },
            ],
          };

          servers.push(newSrv);
          broadcast({
            type: 'server:created',
            server: newSrv,
          });
          break;
        }

        case 'server:delete': {
          const { serverId } = msg;
          const index = servers.findIndex((s) => s.id === serverId);
          if (index !== -1) {
            const deletedSrv = servers[index];
            // Remove channel messages
            for (const cat of deletedSrv.categories) {
              for (const ch of cat.channels) {
                delete messages[ch.id];
              }
            }
            servers.splice(index, 1);
            broadcast({
              type: 'server:deleted',
              serverId,
            });
          }
          break;
        }

        case 'server:update': {
          const { serverId, name, icon } = msg;
          const srv = servers.find((s) => s.id === serverId);
          if (srv) {
            if (name) srv.name = name;
            if (icon !== undefined) srv.icon = icon;
            srv.acronym = srv.name
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 3)
              .toUpperCase() || 'SRV';
            broadcast({
              type: 'server:updated',
              server: srv,
            });
          }
          break;
        }

        case 'server:role:create': {
          const { serverId, role } = msg;
          const srv = servers.find((s) => s.id === serverId);
          if (srv && role) {
            const newRole: Role = {
              id: role.id || `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: role.name || 'Nouveau rôle',
              color: role.color || '#3498DB',
              hoist: Boolean(role.hoist),
            };
            srv.roles.push(newRole);
            broadcast({
              type: 'server:updated',
              server: srv,
            });
            broadcast({
              type: 'server:role:updated',
              serverId,
              roles: srv.roles,
              memberRoles: srv.memberRoles,
            });
          }
          break;
        }

        case 'server:role:delete': {
          const { serverId, roleId } = msg;
          const srv = servers.find((s) => s.id === serverId);
          if (srv) {
            srv.roles = srv.roles.filter((r) => r.id !== roleId);
            if (srv.memberRoles) {
              for (const uId of Object.keys(srv.memberRoles)) {
                srv.memberRoles[uId] = srv.memberRoles[uId].filter((r) => r !== roleId);
              }
            }
            broadcast({
              type: 'server:updated',
              server: srv,
            });
            broadcast({
              type: 'server:role:updated',
              serverId,
              roles: srv.roles,
              memberRoles: srv.memberRoles,
            });
          }
          break;
        }

        case 'server:role:assign': {
          const { serverId, targetUserId, roleId, roleIds, action } = msg;
          const srv = servers.find((s) => s.id === serverId);
          if (srv && targetUserId) {
            srv.memberRoles = srv.memberRoles || {};
            if (roleIds && Array.isArray(roleIds)) {
              srv.memberRoles[targetUserId] = roleIds;
            } else if (roleId) {
              const currentRoles = srv.memberRoles[targetUserId] || [];
              let newRoles: string[];
              if (action === 'add') {
                newRoles = currentRoles.includes(roleId) ? currentRoles : [...currentRoles, roleId];
              } else if (action === 'remove') {
                newRoles = currentRoles.filter((r) => r !== roleId);
              } else {
                newRoles = currentRoles.includes(roleId)
                  ? currentRoles.filter((r) => r !== roleId)
                  : [...currentRoles, roleId];
              }
              srv.memberRoles[targetUserId] = newRoles;
            }
            broadcast({
              type: 'server:updated',
              server: srv,
            });
            broadcast({
              type: 'server:role:updated',
              serverId,
              roles: srv.roles,
              memberRoles: srv.memberRoles,
            });
          }
          break;
        }

        case 'server:join': {
          const { serverId, inviteCode, userId } = msg;
          const srv = servers.find(
            (s) =>
              s.id === serverId ||
              (inviteCode && s.inviteCode && s.inviteCode.trim().toLowerCase() === inviteCode.trim().toLowerCase())
          );
          if (srv && userId) {
            if (!srv.members.includes(userId)) {
              srv.members.push(userId);
            }
            broadcast({
              type: 'server:updated',
              server: srv,
            });
            broadcast({
              type: 'server:member:joined',
              serverId: srv.id,
              server: srv,
              userId,
            });
          }
          break;
        }

        case 'server:invite:send': {
          const { serverId, targetUserId } = msg;
          const inviterId = msg.inviterId || msg.fromUserId;
          const srv = servers.find((s) => s.id === serverId);
          if (srv && targetUserId) {
            if (!srv.members.includes(targetUserId)) {
              srv.members.push(targetUserId);
            }
            broadcast({
              type: 'server:updated',
              server: srv,
            });
            broadcast({
              type: 'server:member:joined',
              serverId: srv.id,
              server: srv,
              userId: targetUserId,
            });

            // Also post DM message to inform the user
            if (inviterId) {
              const dmId = `dm__${[inviterId, targetUserId].sort().join('__')}`;
              const inviteMsg: MessageData = {
                id: `msg_inv_${Date.now()}`,
                channelId: dmId,
                authorId: inviterId,
                content: `🎉 Je t'ai invité à rejoindre le serveur **${srv.name}** ! Tu en fais désormais partie.`,
                timestamp:
                  'Aujourd\'hui à ' +
                  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: [],
              };
              if (!messages[dmId]) messages[dmId] = [];
              messages[dmId].push(inviteMsg);
              broadcast({
                type: 'message:new',
                message: inviteMsg,
              });
            }
          }
          break;
        }
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    const info = clients.get(ws);
    if (info && info.userId) {
      const u = users.get(info.userId);
      if (u) {
        u.status = 'offline';
        u.lastSeen = Date.now();
      }

      // Remove from voice channels
      for (const srv of servers) {
        for (const cat of srv.categories) {
          for (const ch of cat.channels) {
            if (ch.type === 'voice') {
              ch.connectedUsers = ch.connectedUsers?.filter((id) => id !== info.userId);
            }
          }
        }
      }

      broadcast({
        type: 'presence:update',
        users: Array.from(users.values()),
      });
      broadcast({
        type: 'voice:update',
        servers,
      });
    }
    clients.delete(ws);
  });
});

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', onlineClients: clients.size, totalUsers: users.size });
});

// Upload endpoint for photos and attachments
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, name } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const matches = dataUrl.match(/^data:([A-Za-z0-9\-+\.\/]+);base64,(.+)$/);

    if (matches) {
      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      uploadedFiles.set(fileId, {
        buffer,
        mimeType,
        name: name || 'image',
        size: buffer.length,
      });
    } else {
      const buffer = Buffer.from(dataUrl);
      uploadedFiles.set(fileId, {
        buffer,
        mimeType: 'text/plain',
        name: name || 'file',
        size: buffer.length,
      });
    }

    res.json({
      url: `/api/files/${fileId}`,
      fileId,
      name,
    });
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du fichier' });
  }
});

// Endpoint to serve uploaded files and photos directly to any client
app.get('/api/files/:fileId', (req, res) => {
  const file = uploadedFiles.get(req.params.fileId);
  if (!file) {
    return res.status(404).send('Fichier introuvable');
  }
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(file.buffer);
});

app.get('/api/bootstrap', (req, res) => {
  res.json({
    servers,
    messages,
    users: Array.from(users.values()),
  });
});

// Authentication Endpoints
app.get('/api/auth/users', (req, res) => {
  const publicUsers = Array.from(registeredAccounts.values()).map((acc) => {
    const { password, email, ...safe } = acc;
    return safe;
  });
  res.json({ users: publicUsers });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { username, displayName, email, password, avatar, pronouns } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur est requis.' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 4 caractères.' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur ne contient aucun caractère valide (a-z, 0-9, _).' });
    }

    // Check if username already exists
    for (const acc of registeredAccounts.values()) {
      if (acc.username.toLowerCase() === cleanUsername) {
        return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà utilisé par un autre membre.' });
      }
    }

    const randomDiscriminator = Math.floor(1000 + Math.random() * 9000).toString();
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalDisplayName = displayName?.trim() || username.trim();

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    ];
    const finalAvatar = avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newAccount: AccountRecord = {
      id: userId,
      username: cleanUsername,
      displayName: finalDisplayName,
      discriminator: randomDiscriminator,
      email: email?.trim() || `${cleanUsername}@discord.local`,
      password,
      avatar: finalAvatar,
      bannerColor: '#5865F2',
      bannerUrl: '',
      pronouns: pronouns?.trim() || 'il/elle',
      bio: `Bienvenue sur le profil de ${finalDisplayName} ! Membre de la communauté Discord.`,
      badges: ['developer'],
      joinedDiscord: 'Aujourd\'hui',
      status: 'online',
      customStatus: 'Nouveau membre Discord 🎉',
      color: '#5865F2',
    };

    registeredAccounts.set(userId, newAccount);

    const { password: _, email: __, ...publicUserData } = newAccount;
    users.set(userId, publicUserData);

    // Add to default server members
    if (!servers[0].members.includes(userId)) {
      servers[0].members.push(userId);
    }

    // Broadcast new user to all connected clients
    broadcast({
      type: 'presence:update',
      users: Array.from(users.values()),
      serverMembers: servers[0].members,
    });

    return res.status(201).json({
      success: true,
      user: publicUserData,
      token: userId,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Erreur interne lors de la création du compte.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    const cleanInput = username.trim().toLowerCase();

    // Match by username or email
    let foundAccount: AccountRecord | undefined;
    for (const acc of registeredAccounts.values()) {
      if (acc.username.toLowerCase() === cleanInput || (acc.email && acc.email.toLowerCase() === cleanInput)) {
        foundAccount = acc;
        break;
      }
    }

    if (!foundAccount) {
      return res.status(401).json({ error: 'Aucun compte associé à ce nom d\'utilisateur ou e-mail.' });
    }

    if (foundAccount.password !== password) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    foundAccount.status = 'online';
    const { password: _, email: __, ...publicUserData } = foundAccount;
    users.set(foundAccount.id, publicUserData);

    // Make sure user is in server members
    if (!servers[0].members.includes(foundAccount.id)) {
      servers[0].members.push(foundAccount.id);
    }

    broadcast({
      type: 'presence:update',
      users: Array.from(users.values()),
      serverMembers: servers[0].members,
    });

    return res.json({
      success: true,
      user: publicUserData,
      token: foundAccount.id,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur interne lors de la connexion.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || (req.query.userId as string);

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const account = registeredAccounts.get(token);
  if (!account) {
    return res.status(404).json({ error: 'Compte introuvable' });
  }

  const { password: _, email: __, ...publicUserData } = account;
  res.json({ user: publicUserData });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Discord Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
