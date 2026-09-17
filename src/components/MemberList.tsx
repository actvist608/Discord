import React from 'react';
import { User, Role, UserStatus } from '../types';
import { AvatarWithDecoration } from './AvatarWithDecoration';
import { UserDisplayName } from './UserDisplayName';

interface MemberListProps {
  members: User[];
  roles: Role[];
  memberRoles?: Record<string, string[]>;
  onSelectUser: (user: User) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  roles,
  memberRoles = {},
  onSelectUser,
}) => {
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online':
        return 'bg-[#23a55a]';
      case 'idle':
        return 'bg-[#f0b232]';
      case 'dnd':
        return 'bg-[#f23f43]';
      case 'offline':
      default:
        return 'bg-[#80848e]';
    }
  };

  const getMemberHighestRole = (userId: string): Role | undefined => {
    const userRoleIds = memberRoles[userId] || [];
    for (const r of roles) {
      if (userRoleIds.includes(r.id)) {
        return r;
      }
    }
    return undefined;
  };

  const onlineMembers = members.filter((m) => m.status !== 'offline');
  const offlineMembers = members.filter((m) => m.status === 'offline');

  // Build role groups for online members
  const hoistedRoles = roles.filter((r) => r.hoist);
  const assignedUserIds = new Set<string>();

  const roleGroups: { role: Role; members: User[] }[] = [];

  for (const role of hoistedRoles) {
    const groupMembers = onlineMembers.filter((m) => {
      if (assignedUserIds.has(m.id)) return false;
      const uRoles = memberRoles[m.id] || [];
      return uRoles.includes(role.id);
    });

    if (groupMembers.length > 0) {
      roleGroups.push({ role, members: groupMembers });
      groupMembers.forEach((m) => assignedUserIds.add(m.id));
    }
  }

  const otherOnlineMembers = onlineMembers.filter((m) => !assignedUserIds.has(m.id));

  const renderMemberRow = (member: User, role?: Role, isOffline = false) => {
    const isBot = member.username.includes('bot') || member.badges.includes('staff');
    const nameColor = role?.color || member.color || '#dbdee1';

    return (
      <button
        key={member.id}
        onClick={() => onSelectUser(member)}
        className={`w-full h-[44px] px-2 rounded-md flex items-center gap-2.5 hover:bg-[#35373c]/60 transition-colors text-left group ${
          isOffline ? 'opacity-65 hover:opacity-100' : ''
        }`}
      >
        <div className={`relative shrink-0 ${isOffline ? 'grayscale' : ''}`}>
          <AvatarWithDecoration
            avatarUrl={member.avatar}
            decoration={member.avatarDecoration}
            status={member.status}
            size="sm"
            showStatus={true}
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1 leading-tight">
          <div className="flex items-center gap-1.5 min-w-0">
            <UserDisplayName
              name={member.displayName}
              font={member.nameFont}
              color={member.nameColor || nameColor}
              className="text-sm truncate group-hover:underline"
            />
            {isBot && (
              <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1 rounded uppercase tracking-wider shrink-0">
                BOT
              </span>
            )}
            {role && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 hidden group-hover:inline-block"
                style={{
                  backgroundColor: `${role.color}25`,
                  color: role.color,
                }}
              >
                {role.name}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#949ba4] truncate">
            {member.activity ? (
              <span>
                {member.activity.type === 'listening' ? 'Écoute ' : 'Joue à '}
                <span className="text-[#dbdee1]">{member.activity.name}</span>
              </span>
            ) : member.customStatus ? (
              <span>{member.customStatus}</span>
            ) : (
              <span className="opacity-0 group-hover:opacity-60">@{member.username}</span>
            )}
          </span>
        </div>
      </button>
    );
  };

  return (
    <aside
      id="discord-member-list"
      aria-label="Server members"
      className="w-[240px] h-full bg-[#2b2d31] flex flex-col select-none shrink-0 border-l border-[#1f2023] overflow-y-auto px-3 py-4 scrollbar-thin hidden lg:flex"
    >
      {/* Role groups */}
      {roleGroups.map(({ role, members: grpMembers }) => (
        <div key={role.id} className="mb-4">
          <h3
            className="text-[11px] font-bold tracking-wider uppercase px-1 mb-1 truncate"
            style={{ color: role.color }}
          >
            {role.name} — {grpMembers.length}
          </h3>
          <div className="space-y-0.5">
            {grpMembers.map((member) => renderMemberRow(member, role))}
          </div>
        </div>
      ))}

      {/* Online (unhoisted or no role) */}
      {otherOnlineMembers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-bold tracking-wider uppercase text-[#949ba4] px-1 mb-1">
            En ligne — {otherOnlineMembers.length}
          </h3>
          <div className="space-y-0.5">
            {otherOnlineMembers.map((member) =>
              renderMemberRow(member, getMemberHighestRole(member.id))
            )}
          </div>
        </div>
      )}

      {/* Offline */}
      {offlineMembers.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold tracking-wider uppercase text-[#949ba4] px-1 mb-1">
            Hors-ligne — {offlineMembers.length}
          </h3>
          <div className="space-y-0.5">
            {offlineMembers.map((member) =>
              renderMemberRow(member, getMemberHighestRole(member.id), true)
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
