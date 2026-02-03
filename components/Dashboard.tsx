
import React, { useState } from 'react';
import { Card, Badge, Button, getStatusColor } from './UI';
import { StatusLevel } from '../types';
import { MOCK_AGENTS } from '../constants';
import { Activity, AlertOctagon, BrainCircuit, CheckCircle2, ArrowLeft, Bot, User, Send, TrendingUp, Workflow, Plus, Settings, Play, Pause, Save, X, GitCommit, AlertTriangle, Factory, Droplets, Database, FileText, Microscope } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

interface DashboardProps {
    onNavigate: (view: any) => void;
}

// Types for Decision Stream
interface DecisionStream {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
    agents: string[]; // Agent IDs
    updatedAt: string;
}

// Traceability Types (Local Definition to match SimulationEngine)
interface TraceNode {
  id: number;
  label: string;
  type: string;
  icon: any;
  status: 'RISK' | 'UNCERTAIN' | 'NORMAL';
  timestamp: string;
  description: string;
  metrics: { label: string; value: string; trend?: 'up' | 'down' }[];
  evidence: string[];
}

const MOCK_STREAMS: DecisionStream[] = [
    { id: 'DS-01', name: '产销协同决策流', description: '基于订单需求波动自动调整生产排程与物料计划', status: 'ACTIVE', agents: ['A-006', 'A-002', 'A-001'], updatedAt: '10:42' },
    { id: 'DS-02', name: '供应链风险阻断流', description: '监测上游供应中断风险并触发寻源与库存预警', status: 'ACTIVE', agents: ['A-005', 'A-004'], updatedAt: '昨天' },
    { id: 'DS-03', name: '设备预测性维护流', description: '设备故障征兆识别与维修工单自动下发', status: 'PAUSED', agents: ['A-009', 'A-008'], updatedAt: '3天前' },
];

const METRIC_DATA = [
  { name: '自动决策', value: 65, color: '#06b6d4' }, // Cyan
  { name: '人工介入', value: 25, color: '#f59e0b' }, // Amber
  { name: '待处理', value: 10, color: '#334155' },  // Slate
];

const TREND_DATA = [
    { time: '10:38', value: 140.2 },
    { time: '10:39', value: 140.5 },
    { time: '10:40', value: 141.1 },
    { time: '10:41', value: 142.8 }, 
    { time: '10:42', value: 143.2 }, 
    { time: '10:43', value: 143.0 },
];

// Specific Trace Data for Coating Thickness Anomaly
const COATING_TRACE_NODES: TraceNode[] = [
    { 
      id: 1, 
      label: 'IoT感知: 测厚仪报警', 
      type: '传感器', 
      icon: AlertTriangle, 
      status: 'RISK',
      timestamp: '10:42:01',
      description: 'β射线测厚仪 (Gauge-03) 连续 5 次读数超出控制限 (UCL)。检测到面密度分布呈 "左厚右薄" 趋势。',
      metrics: [
        { label: '偏差值', value: '+2.4%', trend: 'up' },
        { label: '持续时间', value: '45s', trend: 'up' }
      ],
      evidence: ['PLC Log: Register #4002 Out of Range', 'Gauge Raw Data Stream']
    },
    { 
      id: 2, 
      label: '设备归因: 模头间隙', 
      type: '生产设备', 
      icon: Factory, 
      status: 'RISK',
      timestamp: '10:42:03',
      description: '设备诊断模型分析显示，#3 涂布头左侧调节螺栓热膨胀系数异常，导致模头间隙 (Gap) 发生微米级偏移。',
      metrics: [
        { label: '间隙偏移', value: '+5μm', trend: 'up' },
        { label: '模头温度', value: '45.2℃' }
      ],
      evidence: ['Equipment Health Model v2.1', 'Thermal Sensor #L-02']
    },
    { 
      id: 3, 
      label: '物料关联: 浆料粘度', 
      type: '物料参数', 
      icon: Droplets, 
      status: 'UNCERTAIN',
      timestamp: '10:42:04',
      description: '关联分析发现，当前批次浆料 (Batch-2024-X) 粘度略低于标准值，加剧了间隙变化对涂布量的敏感性。',
      metrics: [
        { label: '浆料粘度', value: '3800 cP', trend: 'down' },
        { label: '固含量', value: '48.5%' }
      ],
      evidence: ['LIMS Data: Viscosity Test', 'Feeding System Flow Rate']
    },
    { 
      id: 4, 
      label: '质量影响: CPK下降', 
      type: '质量影响', 
      icon: TrendingUp, 
      status: 'RISK',
      timestamp: '10:42:05 (预测)',
      description: '若不干预，预计本卷极片 (Roll-992) 的过程能力指数 (CPK) 将跌破 1.33，导致电芯容量一致性风险。',
      metrics: [
        { label: '当前CPK', value: '1.45' },
        { label: '预测CPK', value: '1.05', trend: 'down' }
      ],
      evidence: ['Quality Prediction Engine', 'Historical Defect Correlation']
    }
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Navigation States
  const [viewMode, setViewMode] = useState<'MONITOR' | 'CONFIG'>('MONITOR');
  const [configStep, setConfigStep] = useState<'LIST' | 'EDITOR'>('LIST');
  
  // Detail States
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<DecisionStream | null>(null);
  
  // Traceability State
  const [selectedTraceNode, setSelectedTraceNode] = useState<TraceNode>(COATING_TRACE_NODES[0]);

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
      { id: 1, role: 'AGENT', content: '监测到 #3 涂布机左侧面密度偏差 > 2% (当前值: 143.2 mg/cm²)。预计影响电芯容量一致性 (CPK 下降至 1.1)。', time: '10:42:05' },
      { id: 2, role: 'AGENT', content: '基于历史数据推演 (Confidence: 92%)，建议执行以下复合调整：\n1. 调整左侧模头间隙 -5μm\n2. 降低涂布速度 -2m/min 以维持干燥一致性。', time: '10:42:06' }
  ]);

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setMessages([...messages, { id: messages.length + 1, role: 'USER', content: chatInput, time: new Date().toLocaleTimeString() }]);
      setChatInput('');
      setTimeout(() => {
          setMessages(prev => [...prev, {
              id: prev.length + 1,
              role: 'AGENT',
              content: '已收到指令。正在模拟调整后的烘箱温度分布... 预测结果安全。是否立即下发 PLC 指令？',
              time: new Date().toLocaleTimeString()
          }]);
      }, 1000);
  };

  // --- Helper: Render Trace Detail (Matching SimulationEngine) ---
  const renderTraceDetailContent = (node: TraceNode) => (
      <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{node.type}</span>
                      <span className="text-xs text-slate-500 font-mono">{node.timestamp}</span>
                  </div>
                  <h3 className="font-medium text-white text-lg">{node.label}</h3>
              </div>
              <Badge status={node.status === 'RISK' ? StatusLevel.RISK : StatusLevel.UNCERTAIN} />
          </div>
          
          <div className="text-slate-400 leading-relaxed mb-6 text-sm">
              {node.description}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              {node.metrics.map((m, i) => (
                  <div key={i} className="bg-slate-900/50 p-3 rounded border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase mb-1">{m.label}</div>
                      <div className="flex items-end gap-2">
                          <span className="font-mono font-medium text-slate-200 text-xl">{m.value}</span>
                          {m.trend === 'up' && <span className="text-red-400 text-xs mb-1">↑</span>}
                          {m.trend === 'down' && <span className="text-red-400 text-xs mb-1">↓</span>}
                      </div>
                  </div>
              ))}
          </div>

          <div>
              <div className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-2">
                  <Database className="w-3 h-3" /> 数据凭证 (Evidence)
              </div>
              <ul className="space-y-2">
                  {node.evidence.map((e, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/30 p-2 rounded border border-slate-800/50">
                          <FileText className="w-3 h-3 text-cyan-500" />
                          {e}
                      </li>
                  ))}
              </ul>
          </div>
      </div>
  );

  // --- Sub-View: Low-Code Stream Editor ---
  const renderStreamEditor = () => {
      if (!selectedStream) return null;
      
      const streamAgents = selectedStream.agents.map(id => MOCK_AGENTS.find(a => a.id === id)).filter(Boolean);

      return (
        <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
             {/* Editor Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setConfigStep('LIST')} className="w-10 h-10 p-0 justify-center rounded-full border border-slate-700">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl text-white font-medium">{selectedStream.name}</h2>
                            <Badge status={selectedStream.status === 'ACTIVE' ? StatusLevel.VERIFIED : StatusLevel.UNCERTAIN} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{selectedStream.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary"><Settings className="w-4 h-4 mr-2" /> 全局参数</Button>
                    <Button><Save className="w-4 h-4 mr-2" /> 保存配置</Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Agent Library */}
                <div className="w-64 flex flex-col gap-4">
                    <Card title="智能体库" className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                            {MOCK_AGENTS.map(agent => (
                                <div key={agent.id} className="p-3 bg-slate-800 border border-slate-700 rounded cursor-move hover:border-cyan-500 transition-colors group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Bot className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm text-slate-200 font-medium">{agent.name}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1">{agent.role}</div>
                                    <div className="flex gap-1 mt-2">
                                        {agent.capabilities.slice(0,1).map((c,i) => (
                                            <span key={i} className="text-[10px] px-1 bg-slate-950 rounded text-slate-400">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 bg-slate-950 rounded border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* Visual Pipeline */}
                    <div className="flex items-center gap-8 relative z-10">
                         {/* Start Node */}
                         <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center bg-slate-900/50 text-slate-500 text-xs font-mono">
                            开始
                         </div>

                         {/* Arrow */}
                         <div className="w-12 h-0.5 bg-slate-700"></div>

                         {/* Stream Agents */}
                         {streamAgents.map((agent, index) => (
                            <React.Fragment key={agent?.id || index}>
                                <div className="relative group">
                                    <div className="w-48 p-4 bg-slate-900 border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.1)] hover:shadow-[0_0_30px_rgba(8,145,178,0.2)] transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <Bot className="w-6 h-6 text-cyan-400" />
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] border border-emerald-500/30">{index + 1}</div>
                                        </div>
                                        <div className="font-medium text-slate-200 text-sm mb-1">{agent?.name}</div>
                                        <div className="text-[10px] text-slate-500">输出: JSON / 信号</div>
                                        
                                        {/* Remove Button */}
                                        <button className="absolute -top-2 -right-2 bg-slate-800 border border-slate-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    
                                    {/* Config Popover (Mock) */}
                                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-800 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-20">
                                        <div className="text-[10px] text-slate-400 uppercase mb-1">流转条件</div>
                                        <div className="text-xs text-cyan-400 font-mono">confidence &gt; 0.85</div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="w-12 h-0.5 bg-slate-700 relative">
                                    {index < streamAgents.length - 1 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 z-10 flex items-center justify-center">
                                            <GitCommit className="w-2 h-2 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                         ))}

                         {/* Add Node Placeholder */}
                         <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-500 hover:bg-cyan-900/10 flex items-center justify-center cursor-pointer transition-all text-slate-600 hover:text-cyan-500">
                            <Plus className="w-6 h-6" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  // --- Sub-View: Config List ---
  const renderConfigList = () => (
      <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-3 gap-6">
              {/* Create New Card */}
              <div 
                onClick={() => { 
                    setSelectedStream({ id: 'NEW', name: '新决策流', description: '点击配置', status: 'DRAFT', agents: [], updatedAt: 'Now' });
                    setConfigStep('EDITOR');
                }}
                className="h-48 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group"
              >
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-medium">新建决策流配置</span>
              </div>

              {/* Existing Streams */}
              {MOCK_STREAMS.map(stream => (
                  <div 
                    key={stream.id}
                    onClick={() => { setSelectedStream(stream); setConfigStep('EDITOR'); }}
                    className="h-48 glass-panel p-6 rounded-lg border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all cursor-pointer flex flex-col relative group overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Workflow className="w-24 h-24 text-cyan-500" />
                      </div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className={`p-2 rounded-lg border ${stream.status === 'ACTIVE' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                              <Workflow className="w-6 h-6" />
                          </div>
                          <Badge status={stream.status === 'ACTIVE' ? StatusLevel.VERIFIED : StatusLevel.UNCERTAIN} />
                      </div>

                      <h3 className="text-lg font-medium text-slate-200 mb-2 relative z-10 group-hover:text-cyan-400 transition-colors">{stream.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1 relative z-10">{stream.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3 relative z-10">
                          <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> {stream.agents.length} 智能体</span>
                          <span>更新于: {stream.updatedAt}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  // --- Sub-View: Decision Detail (Chat) ---
  const renderDecisionDetail = () => (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
              <Button variant="ghost" onClick={() => setSelectedDecision(null)} className="w-10 h-10 p-0 justify-center rounded-full border border-slate-700">
                  <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                  <div className="flex items-center gap-3">
                      <h2 className="text-xl text-white font-medium">异常决策详情: 涂布厚度波动</h2>
                      <Badge status={StatusLevel.RISK} />
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex gap-4">
                      <span>ID: DEC-2024-8832</span>
                      <span>触发时间: 10:42:05</span>
                      <span>来源: Coating-Machine-03</span>
                  </div>
              </div>
          </div>
          <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
              {/* Left Column: Metrics & Traceability */}
              <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
                  <Card title="现场数据快照" className="h-[250px] flex flex-col shrink-0">
                      <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={TREND_DATA}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                                  <YAxis domain={[138, 145]} stroke="#64748b" fontSize={12} />
                                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{r:4}} />
                                  <Line type="monotone" dataKey={() => 140} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
                  
                  {/* Root Cause Traceability Section */}
                  <Card title="归因溯源 (Traceability)" className="flex-1 flex flex-col min-h-[300px]">
                      <div className="flex-1 flex flex-col gap-4">
                          {/* Visual Chain */}
                          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded border border-slate-800 relative overflow-x-auto">
                               {/* SVG Connector Line */}
                               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>

                               {COATING_TRACE_NODES.map((node, index) => (
                                   <React.Fragment key={node.id}>
                                       <div 
                                            onClick={() => setSelectedTraceNode(node)}
                                            className={`relative flex flex-col items-center group cursor-pointer transition-all ${selectedTraceNode.id === node.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                                       >
                                           <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-slate-900 z-10 transition-all ${
                                               selectedTraceNode.id === node.id
                                                ? 'border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                                : (node.status === 'RISK' ? 'border-red-500 text-red-500' : 'border-slate-600 text-slate-500')
                                           }`}>
                                               <node.icon className="w-5 h-5" />
                                           </div>
                                           <div className="mt-2 text-center w-24">
                                               <div className="text-[10px] text-slate-500 font-mono mb-0.5">{node.type}</div>
                                               <div className={`text-xs font-medium truncate ${selectedTraceNode.id === node.id ? 'text-cyan-400' : 'text-slate-300'}`}>{node.label}</div>
                                           </div>
                                       </div>
                                       {index < COATING_TRACE_NODES.length - 1 && (
                                           <div className="flex-1 h-0.5 bg-slate-700 mx-2 min-w-[20px]"></div>
                                       )}
                                   </React.Fragment>
                               ))}
                          </div>
                          
                          {/* Node Preview Detail (Compact) */}
                          <div className="flex-1 bg-slate-900/30 rounded border border-slate-800/50 p-4 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                                   <selectedTraceNode.icon className="w-32 h-32" />
                               </div>
                               {renderTraceDetailContent(selectedTraceNode)}
                          </div>
                      </div>
                  </Card>
              </div>

              {/* Right Column: Chat/Copilot */}
              <Card className="col-span-5 flex flex-col h-full bg-slate-900/80 border-cyan-500/20" title="人机协同对话 (Copilot)">
                  <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 scrollbar-thin">
                      {messages.map((msg) => (
                          <div key={msg.id} className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'AGENT' ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-400' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                                  {msg.role === 'AGENT' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                              </div>
                              <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'AGENT' ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-cyan-900/30 text-cyan-100 border border-cyan-500/30'}`}>
                                  {msg.content}
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-slate-800">
                      <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="输入指令..."
                          className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                      />
                      <Button onClick={handleSendMessage} className="px-3"><Send className="w-4 h-4" /></Button>
                  </div>
              </Card>
          </div>
      </div>
  );

  // --- Main View: Dashboard Monitor ---
  const renderMonitor = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between h-32 bg-gradient-to-br from-slate-900 to-slate-900/50">
           <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">今日自动决策</span>
              <BrainCircuit className="text-cyan-500 w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-mono text-white">1,204</div>
              <div className="text-xs text-emerald-400 mt-1">↑ 12% 环比增长</div>
           </div>
        </Card>
        <Card className="flex flex-col justify-between h-32">
           <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">待人工复核</span>
              <AlertOctagon className="text-amber-500 w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-mono text-white">14</div>
              <div className="text-xs text-amber-500 mt-1">3 个高风险项</div>
           </div>
        </Card>
        <Card className="flex flex-col justify-between h-32">
           <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">活跃智能体</span>
              <Activity className="text-emerald-500 w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-mono text-white">8/12</div>
              <div className="text-xs text-slate-500 mt-1">系统负载 42%</div>
           </div>
        </Card>
        <Card className="flex flex-col justify-between h-32">
           <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">决策闭环率</span>
              <CheckCircle2 className="text-blue-500 w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-mono text-white">98.2%</div>
              <div className="text-xs text-slate-500 mt-1">行动反馈延迟 &lt; 5s</div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
         <div className="col-span-8 space-y-4">
            <h3 className="text-slate-300 font-semibold mb-2 flex items-center gap-2">
               <span className="w-1 h-4 bg-cyan-500 rounded-sm"></span> 
               实时决策流
            </h3>
            <div 
                onClick={() => setSelectedDecision('DEC-1')}
                className="glass-panel p-4 rounded border-l-4 border-l-red-500 flex gap-4 items-center group hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all cursor-pointer relative"
            >
               <div className="p-3 bg-red-900/20 rounded-full border border-red-500/20 group-hover:bg-red-900/40 transition-colors">
                  <AlertOctagon className="text-red-500 w-6 h-6" />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                     <h4 className="text-slate-200 font-medium group-hover:text-cyan-400 transition-colors">涂布厚度异常波动预警 (Coating Thickness)</h4>
                     <span className="text-xs text-slate-500 font-mono">10:42:05</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                     监测到 #3 涂布机左侧面密度偏差 > 2%。预计影响电芯一致性。
                  </p>
                  <div className="flex gap-2">
                     <Badge status={StatusLevel.RISK} />
                     <Badge status={StatusLevel.PROCESSING} className="border-blue-500/30 text-blue-400" />
                  </div>
               </div>
               <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-cyan-500 font-medium">
                   进入对话 <Bot className="w-3 h-3" />
               </div>
            </div>
            
             <div className="glass-panel p-4 rounded border-l-4 border-l-emerald-500 flex gap-4 items-center opacity-80 hover:opacity-100 transition-opacity">
               <div className="p-3 bg-emerald-900/20 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="text-emerald-500 w-6 h-6" />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                     <h4 className="text-slate-200 font-medium">化成工艺自动优化完成</h4>
                     <span className="text-xs text-slate-500 font-mono">10:38:00</span>
                  </div>
                  <p className="text-sm text-slate-400">
                     根据当前批次电解液活性，动态调整了恒流充电时长 (-12min)。产能效率预期提升 1.8%。
                  </p>
               </div>
            </div>
         </div>
         <div className="col-span-4 space-y-6">
             <Card title="决策分布" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={METRIC_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                         {METRIC_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{background: '#0f172a', border: '1px solid #334155'}} itemStyle={{color: '#fff'}} />
                   </PieChart>
                </ResponsiveContainer>
             </Card>
             <Card title="系统健康度">
                <div className="space-y-4 pt-2">
                   <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1"><span>算力资源消耗</span><span>72%</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[72%]"></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1"><span>数据延迟</span><span className="text-emerald-400">12ms</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[95%]"></div></div>
                   </div>
                </div>
             </Card>
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
       {/* Top View Toggle */}
       {!selectedDecision && configStep === 'LIST' && (
           <div className="flex items-center gap-6 mb-6 border-b border-slate-800 pb-1">
               <button 
                onClick={() => setViewMode('MONITOR')}
                className={`pb-3 px-2 text-sm font-medium transition-all relative ${viewMode === 'MONITOR' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
               >
                   <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> 实时监控视图</span>
                   {viewMode === 'MONITOR' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>}
               </button>
               <button 
                onClick={() => setViewMode('CONFIG')}
                className={`pb-3 px-2 text-sm font-medium transition-all relative ${viewMode === 'CONFIG' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
               >
                   <span className="flex items-center gap-2"><Workflow className="w-4 h-4" /> 决策流配置</span>
                   {viewMode === 'CONFIG' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>}
               </button>
           </div>
       )}

       {/* View Logic */}
       <div className="flex-1 min-h-0">
           {selectedDecision ? renderDecisionDetail() : (
               viewMode === 'MONITOR' ? renderMonitor() : (
                   configStep === 'LIST' ? renderConfigList() : renderStreamEditor()
               )
           )}
       </div>
    </div>
  );
};
