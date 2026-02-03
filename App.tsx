
import React, { useState } from 'react';
import { PageView } from './types';
import { Dashboard } from './components/Dashboard';
import { OntologyView } from './components/OntologyView';
import { AgentCenter } from './components/AgentCenter';
import { SimulationEngine } from './components/SimulationEngine';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LayoutDashboard, Database, Bot, LineChart, Settings, Bell, Search, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('DASHBOARD');

  // Navigation Items
  const navItems = [
    { id: 'DASHBOARD', label: '决策中枢', icon: LayoutDashboard },
    { id: 'ONTOLOGY_LIST', label: '业务实体', icon: Database }, 
    { id: 'AGENT_LIST', label: '智能体中心', icon: Bot },
    { id: 'SIMULATION_LIST', label: '推演模拟', icon: LineChart },
    { id: 'KNOWLEDGE_BASE', label: '知识与算法', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard onNavigate={setCurrentView} />;
      case 'ONTOLOGY_LIST': return <OntologyView onNavigate={setCurrentView} />;
      case 'AGENT_LIST': return <AgentCenter onNavigate={setCurrentView} />;
      case 'SIMULATION_LIST': return <SimulationEngine />;
      case 'KNOWLEDGE_BASE': return <KnowledgeBase />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col z-20 shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="w-6 h-6 bg-cyan-500 rounded-sm mr-3 shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
          <span className="font-bold text-lg tracking-tight text-white">NEXUS <span className="text-cyan-400 font-light">智能决策 OS</span></span>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
           {navItems.map(item => (
             <button 
                key={item.id}
                onClick={() => setCurrentView(item.id as PageView)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 group",
                  currentView === item.id 
                    ? "bg-cyan-900/20 text-cyan-400 border-r-2 border-cyan-500" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
             >
                <item.icon className={clsx("w-4 h-4", currentView === item.id ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                {item.label}
             </button>
           ))}

           <div className="pt-6 mt-6 border-t border-slate-800">
              <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase">系统管理</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 rounded-sm hover:bg-slate-800">
                 <Settings className="w-4 h-4" /> 系统配置
              </button>
           </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <div>v2.4.1-build.1043</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            系统运行正常
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
           {/* Breadcrumbs / Title */}
           <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer">平台域</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-medium">
                {navItems.find(n => n.id === currentView)?.label || '智能体中心'}
              </span>
           </div>

           {/* Global Actions */}
           <div className="flex items-center gap-4">
              <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                 <input 
                   type="text" 
                   placeholder="全局搜索 (CMD+K)" 
                   className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none w-64 transition-all focus:w-80"
                 />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white border border-slate-700 shadow-lg cursor-pointer">
                 JD
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-6 relative">
          {/* Subtle Background Mesh */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default App;
