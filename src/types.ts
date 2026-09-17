export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface UserActivity {
  type: 'playing' | 'listening' | 'streaming' | 'compiling';
  name: string;
  details?: string;
  state?: string;
  startTimestamp?: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  discriminator?: string;
  avatar: string;
  bannerColor?: string;
  bannerGradient?: string;
  bannerUrl?: string;
  pronouns?: string;
  status: UserStatus;
  customStatus?: string;
  activity?: UserActivity;
  badges: string[]; // 'hypesquad_bravery', 'nitro', 'booster', 'developer', 'staff'
  bio: string;
  joinedDiscord: string;
  roles?: string[];
  color?: string;
  avatarDecoration?: string;
  profileEffect?: string;
  nameFont?: string;
  nameColor?: string;
  themeColors?: [string, string];
}

export interface Role {
  id: string;
  name: string;
  color: string;
  hoist?: boolean;
  permissions?: string[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  isImage?: boolean;
}

export interface Embed {
  title: string;
  description?: string;
  url?: string;
  color?: string;
  image?: string;
  author?: string;
  footer?: string;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  pinned?: boolean;
  replyToId?: string;
  attachments?: Attachment[];
  embed?: Embed;
  reactions: Reaction[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  topic?: string;
  unread?: boolean;
  mentionsCount?: number;
  userLimit?: number;
  connectedUsers?: string[]; // IDs of users currently in voice
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
  isCollapsed?: boolean;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  acronym: string;
  banner?: string;
  description?: string;
  ownerId: string;
  categories: ChannelCategory[];
  roles: Role[];
  members: string[]; // User IDs
  memberRoles?: Record<string, string[]>; // userId -> roleId[]
  inviteCode?: string;
}

export interface DirectMessageConversation {
  id: string;
  recipientId: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
}

export interface FriendRelation {
  userId: string;
  status: 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked';
  mutualServersCount?: number;
}

export interface VoiceState {
  isConnected: boolean;
  channelId: string | null;
  serverId: string | null;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
}
