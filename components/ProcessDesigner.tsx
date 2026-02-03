
import React, { useRef, useEffect } from 'react';
import { ProcessNode, ProcessLink, StatusLevel } from '../types';
import { MOCK_PROCESS_NODES, MOCK_PROCESS_LINKS, MOCK_CONSTRAINTS, MOCK_SKILLS } from '../constants';
import { Button, Card, getStatusColor } from './UI';
import { Play, Save, Settings, RotateCcw, Plus, ZoomIn, ZoomOut, Shield, BrainCircuit, Box, Workflow, Filter } from 'lucide-react';
import { clsx } from 'clsx';

interface ProcessDesignerProps {
    className?: string;
}

export const ProcessDesigner: React.FC<ProcessDesignerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Simple visual renderer for nodes
  const renderNodes = () => {
    return MOCK_PROCESS_NODES.map((node) => {
      return (
        <div
          key={node.id}
          className={`absolute flex flex-col items-center justify-center p-3 rounded shadow-lg backdrop-blur-sm border cursor-move transition-all hover:scale-105 ${getStatusColor(node.status)}`}
          style={{ 
            left: node.x, 
            top: node.y, 
            width: '160px',
            minHeight: '80px',
            background: 'rgba(15, 23, 42, 0.9)'
          }}
        >
          <span className="text-xs font-mono opacity-50 mb-1">{node.type}</span>
          <span className="text-sm font-bold text-center leading-tight">{node.label}</span>
          {/* Connector Dots */}
          <div className="absolute -left-1 w-2 h-2 bg-slate-400 rounded-full"></div>
          <div className="absolute -right-1 w-2 h-2 bg-slate-400 rounded-full"></div>
        </div>
      );
    });
  };

  // Simple visual renderer for links using SVG
  const renderLinks = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {MOCK_PROCESS_LINKS.map((link, idx) => {
          const startNode = MOCK_PROCESS_NODES.find(n => n.id === link.from);
          const endNode = MOCK_PROCESS_NODES.find(n => n.id === link.to);
          if (!startNode || !endNode) return null;

          const startX = startNode.x + 160; // width
          const startY = startNode.y + 40; // half height
          const endX = endNode.x;
          const endY = endNode.y + 40;

          // Bezier curve
          const d = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;

          return (
            <g key={idx}>
              <path d={d} stroke="#475569" strokeWidth="2" fill="none" />
              <circle cx={endX} cy={endY} r="3" fill="#94a3b8" />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className={clsx("h-full flex flex-col", className)}>
       {/* Toolbar */}
       <div className="flex justify-between items-center mb-4 p-2 bg-slate-900/50 border border-slate-800 rounded">
          <div className="flex items-center gap-4">
             <div className="flex gap-2">
                <Button variant="ghost" className="h-8 w-8 p-0 justify-center"><ZoomIn className="w-4 h-4"/></Button>
                <Button variant="ghost" className="h-8 w-8 p-0 justify-center"><ZoomOut className="w-4 h-4"/></Button>
             </div>
             <div className="w-px h-6 bg-slate-700"></div>
             <span className="text-xs text-slate-400">拖拽节点以编排决策逻辑</span>
          </div>
          <div className="flex gap-2">
             <Button variant="secondary" className="h-8 text-xs"><RotateCcw className="w-3 h-3"/> 试运行</Button>
             <Button className="h-8 text-xs"><Save className="w-3 h-3"/> 保存流程</Button>
          </div>
       </div>

       <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
          {/* Node Library */}
          <Card className="w-64 flex flex-col gap-0 bg-slate-900/80 shrink-0 p-0 overflow-hidden" title="组件与知识库">
              {/* Search Mock */}
              <div className="p-3 border-b border-slate-800">
                  <div className="relative">
                      <input type="text" placeholder="搜索组件..." className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" />
                      <Filter className="w-3 h-3 absolute right-2 top-2 text-slate-500" />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                
                {/* Basic Nodes */}
                <div>
                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-3">
                      <Box className="w-3 h-3" /> 基础组件
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {['数据获取', '条件判断', '智能体调用', '推演模拟', '人工审批'].map(type => (
                        <div key={type} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 cursor-grab hover:border-cyan-500 hover:text-cyan-400 hover:bg-slate-800/80 flex items-center gap-2 transition-all group">
                           <Workflow className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" /> 
                           {type}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Constraints */}
                <div>
                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-3">
                      <Shield className="w-3 h-3" /> 约束规则库
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {MOCK_CONSTRAINTS.slice(0, 8).map(rule => (
                        <div key={rule.id} className="px-3 py-2 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-400 cursor-grab hover:border-red-500/50 hover:text-red-300 hover:bg-red-900/10 flex items-center gap-2 transition-all group" title={rule.description}>
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 group-hover:bg-red-400 shrink-0"></div>
                           <span className="truncate">{rule.name}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-slate-600 text-center hover:text-cyan-500 cursor-pointer pt-1">
                          查看全部 {MOCK_CONSTRAINTS.length} 条规则...
                      </div>
                   </div>
                </div>

                {/* Skills */}
                <div>
                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-3">
                      <BrainCircuit className="w-3 h-3" /> 分析技能库
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {MOCK_SKILLS.slice(0, 8).map(skill => (
                        <div key={skill.id} className="px-3 py-2 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-400 cursor-grab hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-900/10 flex items-center gap-2 transition-all group" title={skill.description}>
                           <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-400 shrink-0"></div>
                           <span className="truncate">{skill.name}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-slate-600 text-center hover:text-cyan-500 cursor-pointer pt-1">
                          查看全部 {MOCK_SKILLS.length} 项技能...
                      </div>
                   </div>
                </div>

              </div>
          </Card>

          {/* Canvas */}
          <div className="flex-1 relative bg-slate-950 rounded border border-slate-800 overflow-hidden" ref={canvasRef}>
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
              ></div>
              
              {renderLinks()}
              {renderNodes()}
          </div>
       </div>
    </div>
  );
};
