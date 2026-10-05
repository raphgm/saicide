import React from 'react';
import { Panel } from '../types';
import {
  Rocket,
  MessageSquare,
  Files,
  GitBranch,
  Settings,
  HelpCircle,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  activePanel: Panel | null;
  onPanelChange: (panel: Panel) => void;
  userPlan?: string;
  onRestrictedClick?: (featureName: string) => void;
  pendingChangesCount?: number;
  isChatOpen?: boolean;
}

const SIDEBAR_GROUPS = [
  {
    label: "Flagship",
    items: [
      { id: Panel.PRODUCTION_ENGINEER, icon: <Rocket size={22} className="text-cyan-400" />, label: "AI Production Engineer" },
      { id: Panel.CHAT, icon: <MessageSquare size={22} className="text-blue-400" />, label: "AI Chat" },
    ]
  },
  {
    label: "Workspace",
    items: [
      { id: Panel.FILES, icon: <Files size={20} />, label: "Files & Code" },
      { id: Panel.SOURCE_CONTROL, icon: <GitBranch size={20} />, label: "Source Control" },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activePanel, 
  onPanelChange, 
  pendingChangesCount = 0,
  isChatOpen = false 
}) => {
  const handleItemClick = (item: any) => {
    onPanelChange(item.id);
  };

  return (
    <nav className="h-full w-14 bg-[var(--color-background-nav)] border-r border-[var(--color-border)] flex flex-col py-3 flex-shrink-0 relative select-none z-50">
      <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center space-y-4">
        {SIDEBAR_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="w-full flex flex-col items-center gap-1.5 pb-2">
            {groupIdx !== 0 && <div className="w-6 h-px bg-white/10 mb-2" />}
            
            {group.items.map((item) => {
              const isActive = item.id === Panel.CHAT ? isChatOpen : activePanel === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  title={item.label}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all flex-shrink-0 group
                    ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] border border-cyan-500/40"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.icon}
                  
                  {isActive && (
                    <span className="absolute left-0 w-[3px] h-4 bg-cyan-400 rounded-r-full" />
                  )}

                  {/* Pending changes badge for Source Control */}
                  {item.id === Panel.SOURCE_CONTROL && pendingChangesCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-blue-400 shadow-lg">
                      {pendingChangesCount > 99 ? '99+' : pendingChangesCount}
                    </div>
                  )}

                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100] transition-opacity translate-x-2 group-hover:translate-x-0 shadow-xl">
                    {item.label} {item.id === Panel.SOURCE_CONTROL && pendingChangesCount > 0 && `(${pendingChangesCount})`}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center flex-shrink-0 pt-2 border-t border-[var(--color-border)]/20 w-full gap-2">
        <button
          onClick={() => onPanelChange(Panel.HELP)}
          title="Documentation"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <HelpCircle size={18} />
        </button>
        <button
          onClick={() => onPanelChange(Panel.SETTINGS)}
          title="Settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          <Settings size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
