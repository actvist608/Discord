import React, { useState } from 'react';
import { Server } from '../types';
import { Compass, Plus, MessageSquare } from 'lucide-react';

interface ServerSidebarProps {
  servers: Server[];
  selectedServerId: string | null; // null means Home/DMs
  onSelectServer: (serverId: string | null) => void;
  onOpenCreateServer: () => void;
  unreadDMsCount: number;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  servers,
  selectedServerId,
  onSelectServer,
  onOpenCreateServer,
  unreadDMsCount,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav
      id="discord-server-sidebar"
      aria-label="Servers sidebar"
      className="w-[72px] h-full bg-[#1e1f22] flex flex-col items-center py-3 select-none z-30 shrink-0 border-r border-[#17181b]"
    >
      {/* Home / Direct Messages Discord Icon */}
      <div className="relative group flex items-center justify-center w-full mb-2">
        {/* Discord sliding pill indicator */}
        <span
          className={`discord-pill absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
            selectedServerId === null
              ? 'h-10'
              : hoveredItem === 'home'
              ? 'h-5'
              : 'h-0'
          }`}
        />
        <button
          id="btn-nav-home"
          onClick={() => onSelectServer(null)}
          onMouseEnter={() => setHoveredItem('home')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`relative flex items-center justify-center w-12 h-12 transition-all duration-200 ${
            selectedServerId === null
              ? 'rounded-2xl bg-[#5865f2] text-white shadow-lg'
              : 'rounded-[24px] hover:rounded-2xl bg-[#313338] hover:bg-[#5865f2] text-[#dbdee1] hover:text-white'
          }`}
          title="Messages privés"
        >
          {/* Discord Official Logo Shape */}
          <svg className="w-7 h-7 fill-current" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>

          {/* Unread badge */}
          {unreadDMsCount > 0 && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-[#f23f43] text-white text-[11px] font-bold px-1.5 py-0.5 min-w-[18px] text-center rounded-full border-2 border-[#1e1f22]">
              {unreadDMsCount}
            </span>
          )}
        </button>

        {/* Discord Tooltip */}
        {hoveredItem === 'home' && (
          <div className="absolute left-[80px] px-3 py-1.5 bg-[#111214] text-white text-sm font-semibold rounded-md whitespace-nowrap shadow-xl z-50 pointer-events-none discord-tooltip animate-in fade-in zoom-in-95 duration-100">
            Messages privés
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-[#35363c] rounded-full mb-2" />

      {/* Server List */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 scrollbar-none">
        {servers.map((server) => {
          const isSelected = selectedServerId === server.id;
          const isHovered = hoveredItem === server.id;

          return (
            <div key={server.id} className="relative group flex items-center justify-center w-full">
              {/* Pill Indicator */}
              <span
                className={`discord-pill absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
                  isSelected
                    ? 'h-10'
                    : isHovered
                    ? 'h-5'
                    : 'h-0'
                }`}
              />

              <button
                id={`btn-server-${server.id}`}
                onClick={() => onSelectServer(server.id)}
                onMouseEnter={() => setHoveredItem(server.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center justify-center w-12 h-12 overflow-hidden transition-all duration-200 font-bold text-sm ${
                  isSelected
                    ? 'rounded-2xl bg-[#5865f2] text-white shadow-lg'
                    : 'rounded-[24px] hover:rounded-2xl bg-[#313338] hover:bg-[#5865f2] text-[#dbdee1] hover:text-white'
                }`}
              >
                {server.icon ? (
                  <img
                    src={server.icon}
                    alt={server.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{server.acronym}</span>
                )}
              </button>

              {/* Server Name Tooltip */}
              {isHovered && (
                <div className="absolute left-[80px] px-3 py-1.5 bg-[#111214] text-white text-sm font-semibold rounded-md whitespace-nowrap shadow-xl z-50 pointer-events-none discord-tooltip animate-in fade-in zoom-in-95 duration-100">
                  {server.name}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
                </div>
              )}
            </div>
          );
        })}

        {/* Add a Server Button */}
        <div className="relative group flex items-center justify-center w-full mt-1">
          <span
            className={`discord-pill absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
              hoveredItem === 'add-server' ? 'h-5' : 'h-0'
            }`}
          />
          <button
            id="btn-add-server"
            onClick={onOpenCreateServer}
            onMouseEnter={() => setHoveredItem('add-server')}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center justify-center w-12 h-12 rounded-[24px] hover:rounded-2xl bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white transition-all duration-200 shadow-sm group"
            title="Ajouter un serveur"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          </button>
          {hoveredItem === 'add-server' && (
            <div className="absolute left-[80px] px-3 py-1.5 bg-[#111214] text-white text-sm font-semibold rounded-md whitespace-nowrap shadow-xl z-50 pointer-events-none discord-tooltip">
              Ajouter un serveur
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
            </div>
          )}
        </div>

        {/* Explore Public Servers Button */}
        <div className="relative group flex items-center justify-center w-full">
          <span
            className={`discord-pill absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
              hoveredItem === 'explore' ? 'h-5' : 'h-0'
            }`}
          />
          <button
            id="btn-explore-servers"
            onMouseEnter={() => setHoveredItem('explore')}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center justify-center w-12 h-12 rounded-[24px] hover:rounded-2xl bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white transition-all duration-200"
            title="Découvrir des serveurs"
          >
            <Compass className="w-6 h-6" />
          </button>
          {hoveredItem === 'explore' && (
            <div className="absolute left-[80px] px-3 py-1.5 bg-[#111214] text-white text-sm font-semibold rounded-md whitespace-nowrap shadow-xl z-50 pointer-events-none discord-tooltip">
              Découvrir des serveurs publics
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
