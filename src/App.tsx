import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  User,
  Message,
  DirectMessageConversation,
  FriendRelation,
  VoiceState,
  UserStatus,
  Attachment,
} from './types';
import {
  getStoredAuthUser,
  saveAuthUser,
  clearAuthUser,
  INITIAL_SERVERS,
  INITIAL_MESSAGES,
  SYSTEM_USER,
} from './data/mockData';
import { AuthScreen } from './components/AuthScreen';
import { ServerSidebar } from './components/ServerSidebar';
import { ChannelSidebar } from './components/ChannelSidebar';
import { HomeSidebar } from './components/HomeSidebar';
import { ChatArea } from './components/ChatArea';
import { VoiceRoomView } from './components/VoiceRoomView';
import { MemberList } from './components/MemberList';
import { FriendsView } from './components/FriendsView';
import { UserProfileModal } from './components/UserProfileModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { CreateChannelModal } from './components/CreateChannelModal';
import { CreateServerModal } from './components/CreateServerModal';
import { ServerSettingsModal } from './components/ServerSettingsModal';
import { ServerInviteModal } from './components/ServerInviteModal';
import { QuickSwitcherModal } from './components/QuickSwitcherModal';
import {
  playJoinSound,
  playLeaveSound,
  playMessageSound,
  playMuteSound,
  playUnmuteSound,
} from './utils/audio';
import { Share2, Check, Radio } from 'lucide-react';

export default function App() {
  // Authenticated User State (checked against stored account)
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredAuthUser());

  // App State
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string | null>('srv_main');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('chan_general');
  const [selectedDMId, setSelectedDMId] = useState<string | null>(null);
  const [isFriendsActive, setIsFriendsActive] = useState<boolean>(false);

  // Real-time Users Map & Messages Store
  const [users, setUsers] = useState<Record<string, User>>(() => {
    const initial: Record<string, User> = { system: SYSTEM_USER };
    const saved = getStoredAuthUser();
    if (saved) {
      initial[saved.id] = saved;
    }
    return initial;
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [dms, setDms] = useState<DirectMessageConversation[]>([]);
  const [friends, setFriends] = useState<FriendRelation[]>([]);

  // Voice State
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isConnected: false,
    channelId: null,
    serverId: null,
    isMuted: false,
    isDeafened: false,
    isScreenSharing: false,
    isVideoOn: false,
    isSpeaking: false,
  });

  // UI Modals & Sidebars
  const [isMemberListOpen, setIsMemberListOpen] = useState<boolean>(true);
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState<boolean>(false);
  const [createChannelCategoryId, setCreateChannelCategoryId] = useState<string | undefined>(undefined);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState<boolean>(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState<boolean>(false);
  const [isServerInviteOpen, setIsServerInviteOpen] = useState<boolean>(false);
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isConnectedToServer, setIsConnectedToServer] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket Connection Lifecycle
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let ws: WebSocket;

    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnectedToServer(true);
        // Identify local user to the server if authenticated
        if (currentUser) {
          ws.send(
            JSON.stringify({
              type: 'identify',
              user: currentUser,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type } = payload;

          switch (type) {
            case 'bootstrap': {
              const {
                servers: remoteServers,
                messages: remoteMessages,
                users: remoteUsers,
              } = payload.data;

              if (remoteServers && remoteServers.length > 0) {
                setServers(remoteServers);
              }

              if (remoteMessages) {
                setMessages(remoteMessages);
              }

              if (remoteUsers) {
                const userMap: Record<string, User> = {
                  system: SYSTEM_USER,
                };
                if (currentUser) {
                  userMap[currentUser.id] = currentUser;
                }
                remoteUsers.forEach((u: User) => {
                  userMap[u.id] = u;
                });
                setUsers(userMap);

                if (currentUser) {
                  const others = remoteUsers.filter((u: User) => u.id !== currentUser.id);
                  setFriends(
                    others.map((u: User) => ({
                      userId: u.id,
                      status: 'friend' as const,
                      since: 'Membre',
                    }))
                  );
                }
              }
              break;
            }

            case 'presence:update': {
              const remoteUsers: User[] = payload.users || [];
              setUsers((prev) => {
                const updated = { ...prev };
                remoteUsers.forEach((u) => {
                  if (currentUser && u.id === currentUser.id) {
                    updated[u.id] = { ...u, ...currentUser };
                  } else {
                    updated[u.id] = u;
                  }
                });
                return updated;
              });

              if (currentUser) {
                const others = remoteUsers.filter((u: User) => u.id !== currentUser.id);
                setFriends((prev) => {
                  if (prev.length === 0 && others.length > 0) {
                    return others.map((u) => ({
                      userId: u.id,
                      status: 'friend' as const,
                      since: 'Membre',
                    }));
                  }
                  return prev;
                });
              }

              if (payload.serverMembers) {
                setServers((prev) =>
                  prev.map((srv, idx) =>
                    idx === 0 ? { ...srv, members: payload.serverMembers } : srv
                  )
                );
              }
              break;
            }

            case 'user:updated': {
              const updatedUser: User = payload.user;
              if (updatedUser) {
                setUsers((prev) => ({
                  ...prev,
                  [updatedUser.id]: updatedUser,
                }));
              }
              break;
            }

            case 'message:new': {
              const incomingMsg: Message = payload.message;
              const author: User | undefined = payload.author;
              if (author) {
                setUsers((prev) => ({
                  ...prev,
                  [author.id]: author,
                }));
              }
              if (incomingMsg) {
                setMessages((prev) => {
                  const channelMsgs = prev[incomingMsg.channelId] || [];
                  // Guard 1: exact ID match
                  if (channelMsgs.some((m) => m.id === incomingMsg.id)) {
                    return prev;
                  }

                  // Guard 2: deduplicate ONLY if this client is the author and has an optimistic placeholder
                  if (currentUser && incomingMsg.authorId === currentUser.id) {
                    const duplicateIndex = channelMsgs.findIndex(
                      (m) =>
                        m.authorId === currentUser.id &&
                        m.content === incomingMsg.content &&
                        m.channelId === incomingMsg.channelId &&
                        (m.id === incomingMsg.id ||
                          Math.abs(Date.now() - (parseInt(m.id.split('_')[1], 10) || 0)) < 15000)
                    );
                    if (duplicateIndex !== -1) {
                      const updated = [...channelMsgs];
                      updated[duplicateIndex] = incomingMsg;
                      return {
                        ...prev,
                        [incomingMsg.channelId]: updated,
                      };
                    }
                  }

                  return {
                    ...prev,
                    [incomingMsg.channelId]: [...channelMsgs, incomingMsg],
                  };
                });

                // Check if message belongs to a DM for the currentUser
                if (currentUser && incomingMsg.channelId.startsWith('dm__') && incomingMsg.channelId.includes(currentUser.id)) {
                  const otherUserId = incomingMsg.channelId
                    .replace('dm__', '')
                    .split('__')
                    .find((id) => id !== currentUser.id);

                  if (otherUserId) {
                    setDms((prev) => {
                      const existingIdx = prev.findIndex((d) => d.id === incomingMsg.channelId || d.recipientId === otherUserId);
                      if (existingIdx !== -1) {
                        const updated = [...prev];
                        updated[existingIdx] = {
                          ...updated[existingIdx],
                          id: incomingMsg.channelId,
                          lastMessage: incomingMsg.content,
                          lastTimestamp: incomingMsg.timestamp,
                          unreadCount: selectedDMId === incomingMsg.channelId ? 0 : (updated[existingIdx].unreadCount || 0) + 1,
                        };
                        return updated;
                      } else {
                        return [
                          {
                            id: incomingMsg.channelId,
                            recipientId: otherUserId,
                            lastMessage: incomingMsg.content,
                            lastTimestamp: incomingMsg.timestamp,
                            unreadCount: selectedDMId === incomingMsg.channelId ? 0 : 1,
                          },
                          ...prev,
                        ];
                      }
                    });
                  }
                }

                if (currentUser && incomingMsg.authorId !== currentUser.id) {
                  playMessageSound();
                }
              }
              break;
            }

            case 'message:reaction': {
              const { messageId, channelId, reactions } = payload;
              setMessages((prev) => {
                const channelMsgs = prev[channelId] || [];
                return {
                  ...prev,
                  [channelId]: channelMsgs.map((m) =>
                    m.id === messageId ? { ...m, reactions } : m
                  ),
                };
              });
              break;
            }

            case 'message:deleted': {
              const { messageId, channelId } = payload;
              setMessages((prev) => {
                const channelMsgs = prev[channelId] || [];
                return {
                  ...prev,
                  [channelId]: channelMsgs.filter((m) => m.id !== messageId),
                };
              });
              break;
            }

            case 'message:pinned': {
              const { messageId, channelId, pinned } = payload;
              setMessages((prev) => {
                const channelMsgs = prev[channelId] || [];
                return {
                  ...prev,
                  [channelId]: channelMsgs.map((m) =>
                    m.id === messageId ? { ...m, pinned } : m
                  ),
                };
              });
              break;
            }

            case 'voice:update': {
              if (payload.servers) {
                setServers(payload.servers);
              }
              break;
            }

            case 'channel:created': {
              const { serverId, categoryId, channel } = payload;
              setServers((prev) =>
                prev.map((srv) => {
                  if (srv.id !== serverId) return srv;
                  return {
                    ...srv,
                    categories: srv.categories.map((cat) =>
                      cat.id === categoryId
                        ? { ...cat, channels: [...cat.channels, channel] }
                        : cat
                    ),
                  };
                })
              );
              break;
            }

            case 'server:created': {
              const { server: newServer } = payload;
              if (newServer) {
                setServers((prev) => {
                  const exists = prev.some((s) => s.id === newServer.id);
                  return exists
                    ? prev.map((s) => (s.id === newServer.id ? newServer : s))
                    : [...prev, newServer];
                });
                setSelectedServerId(newServer.id);
                setIsFriendsActive(false);
                if (newServer.categories?.[0]?.channels?.[0]?.id) {
                  setSelectedChannelId(newServer.categories[0].channels[0].id);
                }
              }
              break;
            }

            case 'server:updated': {
              const { server: updatedServer } = payload;
              if (updatedServer) {
                setServers((prev) =>
                  prev.map((s) => (s.id === updatedServer.id ? updatedServer : s))
                );
              }
              break;
            }

            case 'server:deleted': {
              const { serverId } = payload;
              if (serverId) {
                setServers((prev) => prev.filter((s) => s.id !== serverId));
                setSelectedServerId((curr) => (curr === serverId ? null : curr));
              }
              break;
            }

            case 'server:role:updated': {
              const { serverId, roles, memberRoles } = payload;
              if (serverId) {
                setServers((prev) =>
                  prev.map((s) => {
                    if (s.id !== serverId) return s;
                    return {
                      ...s,
                      roles: roles || s.roles,
                      memberRoles: memberRoles || s.memberRoles,
                    };
                  })
                );
              }
              break;
            }

            case 'server:member:joined': {
              const { server: joinedServer } = payload;
              if (joinedServer) {
                setServers((prev) => {
                  const exists = prev.some((s) => s.id === joinedServer.id);
                  return exists
                    ? prev.map((s) => (s.id === joinedServer.id ? joinedServer : s))
                    : [...prev, joinedServer];
                });
                setSelectedServerId(joinedServer.id);
                setIsFriendsActive(false);
                if (joinedServer.categories?.[0]?.channels?.[0]?.id) {
                  setSelectedChannelId(joinedServer.categories[0].channels[0].id);
                }
              }
              break;
            }
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnectedToServer(false);
        // Try to reconnect in 2 seconds
        reconnectTimer = setTimeout(connectWebSocket, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  // Send identify when currentUser logs in or reconnects
  useEffect(() => {
    if (currentUser && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'identify',
          user: currentUser,
        })
      );
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    saveAuthUser(user);
    setCurrentUser(user);
    setUsers((prev) => ({
      ...prev,
      [user.id]: user,
    }));
  };

  const handleLogout = () => {
    clearAuthUser();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentUser) {
      wsRef.current.send(
        JSON.stringify({
          type: 'profile:update',
          user: { ...currentUser, status: 'offline' },
        })
      );
    }
    setCurrentUser(null);
    setIsSettingsOpen(false);
  };

  // Keyboard shortcut handler (Ctrl+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickSwitcherOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Server selection
  const handleSelectServer = (serverId: string | null) => {
    setSelectedServerId(serverId);
    if (serverId === null) {
      if (!selectedDMId) {
        setIsFriendsActive(true);
      }
    } else {
      setIsFriendsActive(false);
      const srv = servers.find((s) => s.id === serverId);
      if (srv && srv.categories.length > 0 && srv.categories[0].channels.length > 0) {
        const firstText = srv.categories
          .flatMap((c) => c.channels)
          .find((ch) => ch.type === 'text' || ch.type === 'announcement');
        if (firstText) {
          setSelectedChannelId(firstText.id);
        } else {
          setSelectedChannelId(srv.categories[0].channels[0].id);
        }
      }
    }
  };

  // Voice connection handlers
  const handleJoinVoice = (channelId: string) => {
    if (voiceState.channelId === channelId) {
      setSelectedChannelId(channelId);
      return;
    }
    playJoinSound();
    setVoiceState((prev) => ({
      ...prev,
      isConnected: true,
      channelId,
      serverId: selectedServerId,
    }));
    setSelectedChannelId(channelId);

    // Send voice join via WS
    if (currentUser && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'voice:join',
          channelId,
          userId: currentUser.id,
        })
      );
    }
  };

  const handleDisconnectVoice = () => {
    playLeaveSound();
    setVoiceState((prev) => ({
      ...prev,
      isConnected: false,
      channelId: null,
      serverId: null,
      isScreenSharing: false,
      isVideoOn: false,
    }));

    if (currentUser && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'voice:leave',
          userId: currentUser.id,
        })
      );
    }
  };

  const handleToggleVoiceMute = () => {
    const next = !voiceState.isMuted;
    if (next) {
      playMuteSound();
    } else {
      playUnmuteSound();
    }
    setVoiceState((prev) => ({ ...prev, isMuted: next }));
  };

  const handleToggleScreenShare = () => {
    setVoiceState((prev) => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  const handleToggleVideo = () => {
    setVoiceState((prev) => ({ ...prev, isVideoOn: !prev.isVideoOn }));
  };

  // Chat message sending (via WebSocket to broadcast to all open links!)
  const handleSendMessage = (content: string, replyToId?: string, attachment?: Attachment) => {
    if (!currentUser) return;
    const activeTargetId = selectedServerId !== null ? selectedChannelId : selectedDMId;
    if (!activeTargetId) return;

    const trimmedContent = content ? content.trim() : '';
    // Require either text or an attachment
    if (!trimmedContent && !attachment) return;

    playMessageSound();

    const tempId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: Message = {
      id: tempId,
      channelId: activeTargetId,
      authorId: currentUser.id,
      content: trimmedContent,
      timestamp: 'Aujourd\'hui à ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyToId,
      attachments: attachment ? [attachment] : undefined,
      reactions: [],
    };

    // Optimistic local update
    setMessages((prev) => ({
      ...prev,
      [activeTargetId]: [...(prev[activeTargetId] || []), newMsg],
    }));

    // Broadcast through WebSocket to anyone else sharing this link!
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message:send',
          id: tempId,
          channelId: activeTargetId,
          content: trimmedContent,
          authorId: currentUser.id,
          replyToId,
          attachments: attachment ? [attachment] : undefined,
        })
      );
    }

    // If sending in a DM, update the last message in direct messages list immediately
    if (activeTargetId.startsWith('dm__')) {
      const displayPreview = trimmedContent || (attachment?.isImage ? '📷 Photo' : (attachment ? '📎 Fichier' : ''));
      setDms((prev) =>
        prev.map((d) =>
          d.id === activeTargetId
            ? {
                ...d,
                lastMessage: displayPreview,
                lastTimestamp: 'À l\'instant',
              }
            : d
        )
      );
    }
  };

  // Reactions
  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    const activeTargetId = selectedServerId !== null ? selectedChannelId : selectedDMId;
    if (!activeTargetId) return;

    // Send to WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message:react',
          messageId,
          channelId: activeTargetId,
          emoji,
          userId: currentUser.id,
        })
      );
    }
  };

  const handleTogglePin = (messageId: string) => {
    const activeTargetId = selectedServerId !== null ? selectedChannelId : selectedDMId;
    if (!activeTargetId) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message:pin',
          messageId,
          channelId: activeTargetId,
        })
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    const activeTargetId = selectedServerId !== null ? selectedChannelId : selectedDMId;
    if (!activeTargetId) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message:delete',
          messageId,
          channelId: activeTargetId,
        })
      );
    }
  };

  // Create Channel
  const handleCreateChannel = (name: string, type: 'text' | 'voice', categoryId?: string) => {
    if (!selectedServerId) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'channel:create',
          serverId: selectedServerId,
          name,
          channelType: type,
          categoryId,
        })
      );
    }
  };

  // Create Server
  const handleCreateServer = (name: string, icon?: string) => {
    if (!currentUser) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:create',
          name,
          icon,
          ownerId: currentUser.id,
        })
      );
    }
  };

  // Delete Server
  const handleDeleteServer = (serverId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:delete',
          serverId,
        })
      );
    }
    setServers((prev) => prev.filter((s) => s.id !== serverId));
    if (selectedServerId === serverId) {
      setSelectedServerId(null);
      setIsFriendsActive(true);
    }
  };

  // Update Server
  const handleUpdateServer = (serverId: string, name: string, icon?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:update',
          serverId,
          name,
          icon,
        })
      );
    }
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, name, icon: icon || s.icon } : s))
    );
  };

  // Join Server via Invite Code
  const handleJoinServer = (inviteCode: string) => {
    if (!currentUser) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:join',
          inviteCode,
          userId: currentUser.id,
        })
      );
    }
  };

  // Create Role in Server
  const handleCreateRole = (
    serverId: string,
    role: { name: string; color: string; hoist: boolean }
  ) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:role:create',
          serverId,
          role,
        })
      );
    }
  };

  // Delete Role in Server
  const handleDeleteRole = (serverId: string, roleId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:role:delete',
          serverId,
          roleId,
        })
      );
    }
  };

  // Toggle/Assign Role to User in Server (including oneself)
  const handleToggleRole = (serverId: string, targetUserId: string, roleId: string) => {
    const srv = servers.find((s) => s.id === serverId);
    if (!srv) return;
    const currentRoles = srv.memberRoles?.[targetUserId] || [];
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((r) => r !== roleId)
      : [...currentRoles, roleId];

    // Optimistic update
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          memberRoles: {
            ...(s.memberRoles || {}),
            [targetUserId]: newRoles,
          },
        };
      })
    );

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:role:assign',
          serverId,
          targetUserId,
          roleIds: newRoles,
        })
      );
    }
  };

  // Invite User to Server
  const handleInviteUser = (serverId: string, targetUserId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'server:invite:send',
          serverId,
          targetUserId,
          fromUserId: currentUser?.id,
        })
      );
    }
  };

  // DM Handlers
  const handleSelectDM = (dmId: string) => {
    setSelectedDMId(dmId);
    setIsFriendsActive(false);
  };

  const handleStartDMWithUser = (userId: string) => {
    if (!currentUser) return;
    const channelId = `dm__${[currentUser.id, userId].sort().join('__')}`;
    const existing = dms.find((d) => d.id === channelId || d.recipientId === userId);
    if (existing) {
      setSelectedServerId(null);
      setSelectedDMId(existing.id);
      setIsFriendsActive(false);
    } else {
      const newDm: DirectMessageConversation = {
        id: channelId,
        recipientId: userId,
        lastMessage: 'Conversation démarrée',
        lastTimestamp: 'À l\'instant',
      };
      setDms((prev) => [newDm, ...prev]);
      setSelectedServerId(null);
      setSelectedDMId(channelId);
      setIsFriendsActive(false);
    }
  };

  // Profile and Status Updates (Save to LocalStorage + Broadcast to WebSocket)
  const handleUpdateStatus = (status: UserStatus, customStatus?: string) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      status,
      customStatus: customStatus !== undefined ? customStatus : currentUser.customStatus,
    };
    setCurrentUser(updated);
    setUsers((prev) => ({ ...prev, [updated.id]: updated }));
    saveAuthUser(updated);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'profile:update',
          user: updated,
        })
      );
    }
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...updatedFields,
    };
    setCurrentUser(updated);
    setUsers((prev) => ({ ...prev, [updated.id]: updated }));
    saveAuthUser(updated);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'profile:update',
          user: updated,
        })
      );
    }
  };

  // Copy app link to share with another user
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // If user is not logged in / registered, show AuthScreen!
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Current selections
  const currentServer = servers.find((s) => s.id === selectedServerId);
  const currentChannel = currentServer?.categories
    .flatMap((c) => c.channels)
    .find((ch) => ch.id === selectedChannelId);

  const currentDM = dms.find((d) => d.id === selectedDMId);
  const currentRecipientUser = currentDM ? users[currentDM.recipientId] : undefined;

  const currentMessages = selectedServerId !== null
    ? messages[selectedChannelId] || []
    : selectedDMId
    ? messages[selectedDMId] || []
    : [];

  const unreadDMsCount = dms.reduce((acc, d) => acc + (d.unreadCount || 0), 0);
  const isVoiceChannelActive = currentChannel?.type === 'voice';

  // Count active users
  const onlineUsersCount = (Object.values(users) as User[]).filter((u) => u.status !== 'offline').length;

  return (
    <div
      id="discord-app-root"
      className="flex h-screen w-screen bg-[#1e1f22] text-[#dbdee1] overflow-hidden font-sans select-none relative"
    >
      {/* 1. Far Left: Server Icons Sidebar (72px) */}
      <ServerSidebar
        servers={servers}
        selectedServerId={selectedServerId}
        onSelectServer={handleSelectServer}
        onOpenCreateServer={() => setIsCreateServerOpen(true)}
        unreadDMsCount={unreadDMsCount}
      />

      {/* 2. Sub-Sidebar: Channels (if server) or DMs / Friends (if Home) (240px) */}
      {selectedServerId === null ? (
        <HomeSidebar
          conversations={dms}
          users={users}
          selectedDMId={selectedDMId}
          onSelectDM={handleSelectDM}
          onSelectFriendsTab={() => {
            setIsFriendsActive(true);
            setSelectedDMId(null);
          }}
          isFriendsActive={isFriendsActive}
          onOpenQuickSwitcher={() => setIsQuickSwitcherOpen(true)}
          currentUser={currentUser}
          onUpdateStatus={handleUpdateStatus}
          onOpenSettings={() => setIsSettingsOpen(true)}
          pendingFriendsCount={friends.filter((f) => f.status === 'pending_incoming').length}
          onStartNewDM={() => setIsQuickSwitcherOpen(true)}
          onLogout={handleLogout}
        />
      ) : currentServer ? (
        <ChannelSidebar
          server={currentServer}
          selectedChannelId={selectedChannelId}
          onSelectChannel={(chId) => setSelectedChannelId(chId)}
          voiceState={voiceState}
          onJoinVoice={handleJoinVoice}
          onDisconnectVoice={handleDisconnectVoice}
          onOpenCreateChannel={(catId) => {
            setCreateChannelCategoryId(catId);
            setIsCreateChannelOpen(true);
          }}
          currentUser={currentUser}
          users={users}
          onUpdateStatus={handleUpdateStatus}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenServerSettings={() => setIsServerSettingsOpen(true)}
          onOpenInviteModal={() => setIsServerInviteOpen(true)}
          onDeleteServer={() => handleDeleteServer(currentServer.id)}
          onLogout={handleLogout}
        />
      ) : null}

      {/* 3. Main Center Area: Chat / Voice Stage / Friends */}
      <main id="discord-main-viewport" className="flex-1 flex flex-col overflow-hidden relative">
        {/* Real-time sync indicator & share button bar */}
        <div className="bg-[#232428] px-4 py-1.5 flex items-center justify-between border-b border-[#1f2023] text-xs z-10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnectedToServer ? 'bg-[#23a55a] animate-pulse' : 'bg-[#f0b232]'
              }`}
            />
            <span className="text-[#dbdee1] font-medium">
              {isConnectedToServer
                ? `Serveur en direct (${onlineUsersCount} connecté${onlineUsersCount > 1 ? 's' : ''})`
                : 'Connexion au serveur...'}
            </span>
            <span className="text-[#949ba4] hidden sm:inline">
              — Tout utilisateur ouvrant ce même lien discute en direct avec vous
            </span>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold transition-colors shadow-sm cursor-pointer"
            title="Copier le lien pour inviter quelqu'un à chatter"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Lien copié !' : 'Partager le lien'}</span>
          </button>
        </div>

        {/* View content */}
        <div className="flex-1 flex overflow-hidden">
          {selectedServerId === null && isFriendsActive ? (
            <FriendsView
              friends={friends}
              users={users}
              onStartDM={handleStartDMWithUser}
              onSelectUser={(u) => setInspectUser(u)}
            />
          ) : isVoiceChannelActive && currentChannel ? (
            <VoiceRoomView
              channelName={currentChannel.name}
              voiceState={voiceState}
              currentUser={currentUser}
              connectedUsers={
                currentChannel.connectedUsers
                  ? currentChannel.connectedUsers.map((id) => users[id]).filter(Boolean)
                  : []
              }
              onDisconnect={handleDisconnectVoice}
              onToggleMute={handleToggleVoiceMute}
              onToggleScreenShare={handleToggleScreenShare}
              onToggleVideo={handleToggleVideo}
            />
          ) : (
            <ChatArea
              channel={currentChannel}
              recipientUser={currentRecipientUser}
              messages={currentMessages}
              users={users}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onToggleReaction={handleToggleReaction}
              onTogglePin={handleTogglePin}
              onDeleteMessage={handleDeleteMessage}
              onSelectUser={(u) => setInspectUser(u)}
              isMemberListOpen={isMemberListOpen}
              onToggleMemberList={() => setIsMemberListOpen(!isMemberListOpen)}
              onOpenQuickSwitcher={() => setIsQuickSwitcherOpen(true)}
            />
          )}

          {/* 4. Right: Member List (if server & text channel & open) */}
          {selectedServerId !== null && !isVoiceChannelActive && isMemberListOpen && currentServer && (
            <MemberList
              members={
                currentServer.members.length > 0
                  ? currentServer.members.map((id) => users[id]).filter(Boolean)
                  : Object.values(users)
              }
              roles={currentServer.roles}
              memberRoles={currentServer.memberRoles}
              onSelectUser={(u) => setInspectUser(u)}
            />
          )}
        </div>
      </main>

      {/* Modals & Popovers */}

      {/* User Profile Popout Modal */}
      {inspectUser && (
        <UserProfileModal
          user={inspectUser}
          server={currentServer || undefined}
          currentUser={currentUser || undefined}
          onToggleRole={currentServer ? (roleId) => handleToggleRole(currentServer.id, inspectUser.id, roleId) : undefined}
          onClose={() => setInspectUser(null)}
          onSendDM={(targetUid) => {
            handleStartDMWithUser(targetUid);
            setInspectUser(null);
          }}
        />
      )}

      {/* Full-Screen User Settings Modal */}
      {isSettingsOpen && (
        <UserSettingsModal
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Create Channel Modal */}
      {isCreateChannelOpen && (
        <CreateChannelModal
          categoryId={createChannelCategoryId}
          onClose={() => setIsCreateChannelOpen(false)}
          onCreateChannel={handleCreateChannel}
        />
      )}

      {/* Create Server Modal */}
      {isCreateServerOpen && (
        <CreateServerModal
          onClose={() => setIsCreateServerOpen(false)}
          onCreateServer={handleCreateServer}
          onJoinServer={handleJoinServer}
        />
      )}

      {/* Server Settings Modal */}
      {isServerSettingsOpen && currentServer && (
        <ServerSettingsModal
          server={currentServer}
          currentUser={currentUser}
          users={users}
          onClose={() => setIsServerSettingsOpen(false)}
          onUpdateServer={handleUpdateServer}
          onDeleteServer={handleDeleteServer}
          onCreateRole={handleCreateRole}
          onDeleteRole={handleDeleteRole}
          onToggleRole={handleToggleRole}
        />
      )}

      {/* Server Invite Modal */}
      {isServerInviteOpen && currentServer && (
        <ServerInviteModal
          server={currentServer}
          currentUser={currentUser}
          users={users}
          onClose={() => setIsServerInviteOpen(false)}
          onInviteUser={handleInviteUser}
        />
      )}

      {/* Quick Switcher Modal (Ctrl + K) */}
      {isQuickSwitcherOpen && (
        <QuickSwitcherModal
          servers={servers}
          users={users}
          dms={dms}
          onClose={() => setIsQuickSwitcherOpen(false)}
          onNavigateChannel={(srvId, chId) => {
            setSelectedServerId(srvId);
            setSelectedChannelId(chId);
            setIsFriendsActive(false);
          }}
          onNavigateDM={(dmId) => {
            setSelectedServerId(null);
            setSelectedDMId(dmId);
            setIsFriendsActive(false);
          }}
          onNavigateServer={(srvId) => {
            handleSelectServer(srvId);
          }}
        />
      )}
    </div>
  );
}
