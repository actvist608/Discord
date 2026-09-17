import React, { useState, useRef, useEffect } from 'react';
import { Channel, Message, User, Attachment } from '../types';
import { EMOJI_LIST, GIF_LIST } from '../data/mockData';
import { playMessageSound } from '../utils/audio';
import { fileToDataUrl, extractImagesFromContent, isImageUrl, uploadImageFile } from '../utils/imageUtils';
import { ImageEmbed } from './ImageEmbed';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';
import {
  Hash,
  Volume2,
  Megaphone,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
  PlusCircle,
  Gift,
  Smile,
  Image as ImageIcon,
  Send,
  Reply,
  Trash2,
  Copy,
  Check,
  X,
  Sparkles,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ChatAreaProps {
  channel?: Channel;
  recipientUser?: User; // if DM
  messages: Message[];
  users: Record<string, User>;
  currentUser: User;
  onSendMessage: (content: string, replyToId?: string, attachment?: Attachment) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onTogglePin: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onSelectUser: (user: User) => void;
  isMemberListOpen: boolean;
  onToggleMemberList: () => void;
  onOpenQuickSwitcher: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  recipientUser,
  messages,
  users,
  currentUser,
  onSendMessage,
  onToggleReaction,
  onTogglePin,
  onDeleteMessage,
  onSelectUser,
  isMemberListOpen,
  onToggleMemberList,
  onOpenQuickSwitcher,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showPinsDrawer, setShowPinsDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Ambient simulated typing indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingSimulated(true);
      const hideTimer = setTimeout(() => {
        setIsTypingSimulated(false);
      }, 4000);
      return () => clearTimeout(hideTimer);
    }, 12000);

    return () => clearTimeout(timer);
  }, [channel?.id, recipientUser?.id]);

  const isSendingRef = useRef(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSendingRef.current) return;

    const text = inputText.trim();
    if (!text) return;

    isSendingRef.current = true;
    setInputText('');
    const replyId = replyingTo?.id;
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowGifPicker(false);

    onSendMessage(text, replyId);

    // Release send lock after a short delay
    setTimeout(() => {
      isSendingRef.current = false;
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      handleSend();
    }
  };

  const processAndSendFile = async (file: File) => {
    const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(file.name);
    let fileUrl = '';
    let sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    if (isImg) {
      const uploadResult = await uploadImageFile(file);
      fileUrl = uploadResult.url;
      sizeFormatted = uploadResult.sizeFormatted;
    } else {
      fileUrl = URL.createObjectURL(file);
    }

    const att: Attachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      url: fileUrl,
      size: sizeFormatted,
      isImage: isImg,
    };

    const text = inputText.trim();
    onSendMessage(text, replyingTo?.id, att);
    setInputText('');
    setReplyingTo(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndSendFile(file);
      e.target.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            await processAndSendFile(file);
            return;
          }
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndSendFile(file);
    }
  };

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Helper to render Discord markdown: bold, code blocks, quotes, spoilers, mentions
  const renderFormattedContent = (content: string, msgId: string) => {
    // Check code blocks
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, idx) => {
        if (idx % 2 === 1) {
          // It's a code block
          const lines = part.trim().split('\n');
          const firstLine = lines[0].toLowerCase();
          const hasLang = ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'python'].includes(firstLine);
          const lang = hasLang ? lines[0] : '';
          const code = hasLang ? lines.slice(1).join('\n') : part;

          return (
            <div
              key={idx}
              className="my-2 bg-[#1e1f22] border border-[#232428] rounded-md overflow-hidden text-xs font-mono group/code"
            >
              <div className="bg-[#2b2d31]/80 px-3 py-1.5 flex items-center justify-between text-[#949ba4] border-b border-[#1e1f22]">
                <span className="uppercase text-[10px] font-bold">{lang || 'CODE'}</span>
                <button
                  onClick={() => handleCopyCode(code, `${msgId}-${idx}`)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedCodeId === `${msgId}-${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#23a55a]" />
                      <span className="text-[#23a55a]">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[#dbdee1] overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return <span key={idx}>{renderInlineMarkdown(part, msgId)}</span>;
      });
    }

    return renderInlineMarkdown(content, msgId);
  };

  const renderInlineMarkdown = (text: string, msgId: string) => {
    // Spoilers ||hidden||
    if (text.includes('||')) {
      const parts = text.split('||');
      return parts.map((seg, i) => {
        if (i % 2 === 1) {
          const isRevealed = revealedSpoilers[`${msgId}-${i}`];
          return (
            <span
              key={i}
              onClick={() => toggleSpoiler(`${msgId}-${i}`)}
              className={`cursor-pointer rounded px-1.5 py-0.5 text-xs font-medium transition-all ${
                isRevealed
                  ? 'bg-[#2b2d31] text-[#dbdee1]'
                  : 'bg-[#202225] text-transparent hover:bg-[#2f3136] select-none'
              }`}
              title={isRevealed ? 'Cliquer pour cacher' : 'Spoiler : cliquer pour révéler'}
            >
              {seg}
            </span>
          );
        }
        return <span key={i}>{renderTextElements(seg)}</span>;
      });
    }

    return renderTextElements(text);
  };

  const renderTextElements = (text: string) => {
    // Handle inline code `code`
    if (text.includes('`')) {
      const parts = text.split('`');
      return parts.map((chunk, i) => {
        if (i % 2 === 1) {
          return (
            <code
              key={i}
              className="bg-[#1e1f22] text-[#e3e5e8] px-1.5 py-0.5 rounded text-[13px] font-mono border border-[#2b2d31]"
            >
              {chunk}
            </code>
          );
        }
        return <span key={i}>{renderMentionsAndBold(chunk)}</span>;
      });
    }

    return renderMentionsAndBold(text);
  };

  const renderMentionsAndBold = (text: string) => {
    // Mentions (@someone), bold (**text**), and clickable links (http://, https://)
    const words = text.split(/(\s+)/);
    return words.map((w, idx) => {
      if (w.startsWith('@') && w.length > 1) {
        return (
          <span
            key={idx}
            className="bg-[#5865f2]/20 hover:bg-[#5865f2]/30 text-[#c9cdfb] font-semibold px-1 py-0.5 rounded transition-colors cursor-pointer"
          >
            {w}
          </span>
        );
      }
      // Simple Bold **text**
      if (w.startsWith('**') && w.endsWith('**') && w.length > 4) {
        return <strong key={idx} className="font-bold text-white">{w.slice(2, -2)}</strong>;
      }
      // Clickable URL links
      if (w.startsWith('http://') || w.startsWith('https://')) {
        return (
          <a
            key={idx}
            href={w}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00a8fc] hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {w}
          </a>
        );
      }
      return w;
    });
  };

  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          users[m.authorId]?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const pinnedMessages = messages.filter((m) => m.pinned);

  const titleName = channel ? channel.name : recipientUser?.displayName || 'Chat';
  const topicDesc = channel?.topic || recipientUser?.customStatus || 'Discussion privée';

  return (
    <div
      id="discord-chat-container"
      className="flex-1 bg-[#313338] flex flex-col justify-between h-full relative overflow-hidden select-text"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 bg-[#5865f2]/25 border-4 border-dashed border-[#5865f2] z-50 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="bg-[#2b2d31] p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border border-[#35373c] animate-in zoom-in-95 duration-100">
            <ImageIcon className="w-12 h-12 text-[#5865f2] animate-bounce" />
            <span className="text-white font-bold text-base">Déposez votre image ou fichier ici</span>
            <span className="text-xs text-[#949ba4]">Tout le monde verra directement l'image dans le chat</span>
          </div>
        </div>
      )}
      {/* Top Header Bar */}
      <header className="h-12 px-4 bg-[#313338] flex items-center justify-between border-b border-[#1f2023] shadow-sm shrink-0 z-10 select-none">
        <div className="flex items-center gap-2 min-w-0">
          {channel?.type === 'voice' ? (
            <Volume2 className="w-6 h-6 text-[#949ba4] shrink-0" />
          ) : channel?.type === 'announcement' ? (
            <Megaphone className="w-6 h-6 text-[#949ba4] shrink-0" />
          ) : (
            <Hash className="w-6 h-6 text-[#949ba4] shrink-0" />
          )}

          <h2 className="font-bold text-white text-base truncate">{titleName}</h2>

          <div className="h-4 w-[1px] bg-[#4e5058] mx-2 shrink-0 hidden sm:block" />

          <p className="text-xs text-[#949ba4] truncate hidden sm:block max-w-md">
            {topicDesc}
          </p>
        </div>

        {/* Header Right Action Icons */}
        <div className="flex items-center gap-3 text-[#b5bac1]">
          {/* Pinned Messages Button */}
          <button
            id="btn-pinned-messages"
            onClick={() => setShowPinsDrawer(!showPinsDrawer)}
            title="Messages épinglés"
            className={`p-1 rounded hover:text-[#dbdee1] transition-colors ${
              showPinsDrawer ? 'text-[#5865f2]' : ''
            }`}
          >
            <Pin className="w-5 h-5" />
          </button>

          {/* Notifications Bell */}
          <button
            title="Paramètres de notification"
            className="p-1 rounded hover:text-[#dbdee1] transition-colors hidden sm:block"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Member List Toggle */}
          <button
            id="btn-toggle-memberlist"
            onClick={onToggleMemberList}
            title={isMemberListOpen ? 'Masquer la liste des membres' : 'Afficher la liste des membres'}
            className={`p-1 rounded hover:text-[#dbdee1] transition-colors ${
              isMemberListOpen ? 'text-[#5865f2]' : ''
            }`}
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="relative flex items-center bg-[#1e1f22] rounded px-2 py-1 text-xs">
            <input
              type="text"
              placeholder="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[#dbdee1] placeholder:text-[#949ba4] focus:outline-none w-24 sm:w-36 focus:w-48 transition-all"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-3.5 h-3.5 text-[#949ba4]" />
            )}
          </div>

          <button
            onClick={onOpenQuickSwitcher}
            title="Boîte de réception / Ctrl + K"
            className="p-1 rounded hover:text-[#dbdee1] transition-colors hidden md:block"
          >
            <Inbox className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {/* Welcome Channel Banner at Top */}
        <div className="pt-8 pb-4 border-b border-[#35373c]/60 select-none">
          <div className="w-16 h-16 rounded-full bg-[#404249] flex items-center justify-center text-white mb-3">
            <Hash className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Bienvenue dans #{titleName} !
          </h1>
          <p className="text-sm text-[#949ba4]">
            C'est le tout début du salon #{titleName}. Saluez la communauté !
          </p>
        </div>

        {/* Message List */}
        {filteredMessages.map((msg) => {
          const author =
            users[msg.authorId] ||
            (msg.authorId === currentUser.id
              ? currentUser
              : {
                  id: msg.authorId,
                  displayName: `Utilisateur (${msg.authorId.slice(-4)})`,
                  username: `user_${msg.authorId.slice(-4)}`,
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                  status: 'online' as const,
                  badges: [],
                  bio: 'Membre du serveur Discord',
                  joinedDiscord: 'Récemment',
                });
          const isMe = msg.authorId === currentUser.id;
          const isBot = author.username.includes('bot');

          return (
            <div
              key={msg.id}
              className="group relative flex gap-4 -mx-4 px-4 py-1.5 hover:bg-[#2e3035]/60 transition-colors rounded"
            >
              {/* Message Quick Action Bar on Hover */}
              <div className="absolute right-4 -top-3 hidden group-hover:flex items-center bg-[#313338] border border-[#2b2d31] rounded-md shadow-lg p-0.5 gap-0.5 text-[#b5bac1] z-20 select-none">
                <button
                  onClick={() => onToggleReaction(msg.id, '❤️')}
                  title="Ajouter une réaction ❤️"
                  className="p-1.5 hover:bg-[#35373c] hover:text-white rounded transition-colors text-xs"
                >
                  ❤️
                </button>
                <button
                  onClick={() => onToggleReaction(msg.id, '🚀')}
                  title="Ajouter une réaction 🚀"
                  className="p-1.5 hover:bg-[#35373c] hover:text-white rounded transition-colors text-xs"
                >
                  🚀
                </button>
                <button
                  onClick={() => onToggleReaction(msg.id, '🔥')}
                  title="Ajouter une réaction 🔥"
                  className="p-1.5 hover:bg-[#35373c] hover:text-white rounded transition-colors text-xs"
                >
                  🔥
                </button>
                <div className="w-[1px] h-4 bg-[#35373c] mx-0.5" />
                <button
                  onClick={() => setReplyingTo(msg)}
                  title="Répondre"
                  className="p-1.5 hover:bg-[#35373c] hover:text-white rounded transition-colors"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTogglePin(msg.id)}
                  title={msg.pinned ? 'Détacher le message' : 'Épingler le message'}
                  className={`p-1.5 hover:bg-[#35373c] rounded transition-colors ${
                    msg.pinned ? 'text-[#f0b232]' : 'hover:text-white'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>
                {isMe && (
                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    title="Supprimer le message"
                    className="p-1.5 hover:bg-[#35373c] hover:text-[#f23f43] rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Author Avatar with Decoration & GIF support */}
              <div className="shrink-0 mt-0.5">
                <AvatarWithDecoration
                  avatarUrl={author.avatar}
                  decoration={author.avatarDecoration}
                  size="md"
                  onClick={() => onSelectUser(author)}
                  showStatus={false}
                />
              </div>

              {/* Message Body */}
              <div className="flex-1 min-w-0">
                {/* Replying quote preview (if reply) */}
                {msg.replyToId && (
                  <div className="flex items-center gap-1.5 text-xs text-[#949ba4] mb-1 select-none">
                    <Reply className="w-3.5 h-3.5 rotate-180 text-[#5865f2]" />
                    <span className="font-semibold text-[#b5bac1]">
                      @{users[messages.find((m) => m.id === msg.replyToId)?.authorId || '']?.displayName || 'Membre'}
                    </span>
                    <span className="truncate max-w-sm italic">
                      {messages.find((m) => m.id === msg.replyToId)?.content || 'Message supprimé'}
                    </span>
                  </div>
                )}

                {/* Author row */}
                <div className="flex items-baseline gap-2 leading-none mb-1">
                  <UserDisplayName
                    name={author.displayName}
                    font={author.nameFont}
                    color={author.nameColor || author.color || '#f2f3f5'}
                    className="text-sm"
                    onClick={() => onSelectUser(author)}
                  />

                  {isBot && (
                    <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                      BOT
                    </span>
                  )}

                  <span className="text-[11px] text-[#949ba4]">{msg.timestamp}</span>

                  {msg.pinned && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#f0b232] font-semibold">
                      <Pin className="w-3 h-3 fill-current" /> Épinglé
                    </span>
                  )}
                </div>

                {/* Content Text with Markdown, Spoilers, and Auto-detected Images */}
                {(() => {
                  const { cleanText, imageUrls } = extractImagesFromContent(msg.content);
                  return (
                    <div className="space-y-2">
                      {cleanText ? (
                        <div className="text-sm text-[#dbdee1] leading-relaxed whitespace-pre-wrap break-words">
                          {renderFormattedContent(cleanText, msg.id)}
                        </div>
                      ) : null}

                      {/* Display image URLs as real images */}
                      {imageUrls.map((imgUrl, imgIdx) => (
                        <div key={imgIdx}>
                          <ImageEmbed
                            url={imgUrl}
                            alt="Image partagée"
                            onExpand={(u) => setExpandedImageUrl(u)}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Attachments */}
                {msg.attachments?.map((att) => (
                  <div key={att.id} className="mt-2">
                    {att.isImage ? (
                      <ImageEmbed
                        url={att.url}
                        alt={att.name}
                        name={att.name}
                        onExpand={(u) => setExpandedImageUrl(u)}
                      />
                    ) : (
                      <div className="p-3 bg-[#2b2d31] rounded-lg border border-[#35373c] flex items-center gap-3 max-w-sm">
                        <ImageIcon className="w-6 h-6 text-[#5865f2] shrink-0" />
                        <div className="flex flex-col text-xs truncate">
                          <span className="font-semibold text-white truncate">{att.name}</span>
                          <span className="text-[#949ba4]">{att.size}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Reactions list */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 select-none">
                    {msg.reactions.map((r, i) => {
                      const hasReacted = r.users.includes(currentUser.id);
                      return (
                        <button
                          key={i}
                          onClick={() => onToggleReaction(msg.id, r.emoji)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border transition-all ${
                            hasReacted
                              ? 'bg-[#5865f2]/20 border-[#5865f2] text-[#c9cdfb]'
                              : 'bg-[#2b2d31] border-transparent hover:border-[#35373c] text-[#b5bac1]'
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Replying banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-[#2b2d31] border-t border-[#1f2023] flex items-center justify-between text-xs text-[#b5bac1] select-none">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-4 h-4 text-[#5865f2]" />
            <span>Réponse à</span>
            <span className="font-bold text-white">
              @{users[replyingTo.authorId]?.displayName || 'Membre'}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Typing Indicator Bar */}
      <div className="h-6 px-4 flex items-center text-xs text-[#b5bac1] select-none">
        {isTypingSimulated && (
          <div className="flex items-center gap-1.5 animate-pulse">
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-[#b5bac1] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#b5bac1] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#b5bac1] rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
            <span className="font-semibold text-white">Alexandre</span> est en train d'écrire...
          </div>
        )}
      </div>

      {/* Composer Input Area */}
      <div className="px-4 pb-6 select-none relative">
        {/* GIF Picker Popover */}
        {showGifPicker && (
          <div className="absolute bottom-20 right-12 w-80 bg-[#2b2d31] border border-[#35373c] rounded-xl p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#35373c] mb-2 text-xs font-bold text-white">
              <span>GIFs populaires</span>
              <button onClick={() => setShowGifPicker(false)} className="hover:text-[#f23f43]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-thin">
              {GIF_LIST.map((gif, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSendMessage(gif.url);
                    setShowGifPicker(false);
                  }}
                  className="relative rounded-lg overflow-hidden group aspect-video bg-[#1e1f22]"
                >
                  <img src={gif.url} alt={gif.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {gif.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 w-72 bg-[#2b2d31] border border-[#35373c] rounded-xl p-3 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#35373c] mb-2 text-xs font-bold text-white">
              <span>Émojis Discord</span>
              <button onClick={() => setShowEmojiPicker(false)} className="hover:text-[#f23f43]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 max-h-56 overflow-y-auto p-1 scrollbar-thin">
              {EMOJI_LIST.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#35373c] rounded transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar Container */}
        <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-3">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.zip"
          />
          <button
            id="btn-upload-attachment"
            onClick={() => fileInputRef.current?.click()}
            title="Ajouter un fichier"
            className="text-[#b5bac1] hover:text-white bg-[#4e5058] hover:bg-[#6d6f78] rounded-full p-1 transition-colors shrink-0"
          >
            <PlusCircle className="w-5 h-5 fill-current text-[#383a40]" />
          </button>

          {/* Textarea */}
          <textarea
            id="input-discord-chat"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={`Envoyer un message dans #${titleName}`}
            className="w-full bg-transparent text-sm text-[#dbdee1] placeholder:text-[#949ba4] focus:outline-none resize-none max-h-36 leading-normal"
          />

          {/* Right Action Icons in Input */}
          <div className="flex items-center gap-2 text-[#b5bac1] shrink-0">
            <button
              onClick={() => setShowGifPicker(!showGifPicker)}
              title="Choisir un GIF"
              className={`p-1 font-bold text-xs rounded hover:text-white transition-colors ${
                showGifPicker ? 'text-[#5865f2]' : ''
              }`}
            >
              GIF
            </button>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Choisir un émoji"
              className={`p-1 rounded hover:text-white transition-colors ${
                showEmojiPicker ? 'text-[#f0b232]' : ''
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>

            {inputText.trim() && (
              <button
                onClick={() => handleSend()}
                title="Envoyer le message"
                className="p-1 text-[#5865f2] hover:text-[#4752c4] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pinned Messages Drawer */}
      {showPinsDrawer && (
        <div className="absolute top-12 right-0 bottom-0 w-80 bg-[#2b2d31] border-l border-[#1f2023] shadow-2xl z-30 flex flex-col p-4 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#35373c] mb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Pin className="w-4 h-4 text-[#f0b232]" />
              <span>Messages épinglés</span>
            </div>
            <button
              onClick={() => setShowPinsDrawer(false)}
              className="text-[#949ba4] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
            {pinnedMessages.length === 0 ? (
              <p className="text-xs text-[#949ba4] text-center mt-8">
                Aucun message épinglé pour le moment.
              </p>
            ) : (
              pinnedMessages.map((pinMsg) => (
                <div
                  key={pinMsg.id}
                  className="bg-[#1e1f22] p-3 rounded-lg border border-[#35373c] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[#949ba4]">
                    <span className="font-semibold text-white">
                      {users[pinMsg.authorId]?.displayName || 'Auteur'}
                    </span>
                    <span className="text-[10px]">{pinMsg.timestamp}</span>
                  </div>
                  <p className="text-[#dbdee1]">{pinMsg.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {expandedImageUrl && (
        <div
          id="image-lightbox-modal"
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-150 select-none"
          onClick={() => setExpandedImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2.5 text-white">
              <a
                href={expandedImageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#5865f2] hover:underline flex items-center gap-1.5 bg-[#1e1f22] px-3 py-1.5 rounded-md border border-[#35373c] transition-colors hover:bg-[#2b2d31]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir l'original</span>
              </a>
              <button
                onClick={() => setExpandedImageUrl(null)}
                className="p-1.5 rounded-full bg-[#1e1f22] hover:bg-[#35373c] text-[#dbdee1] hover:text-white transition-colors border border-[#35373c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={expandedImageUrl}
              alt="Aperçu de l'image"
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl border border-[#35373c]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
