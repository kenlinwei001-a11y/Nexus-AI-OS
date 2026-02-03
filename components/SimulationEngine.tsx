
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge, getStatusColor } from './UI';
import { MOCK_SCENARIOS } from '../constants';
import { StatusLevel } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell } from 'recharts';
import { Play, TrendingUp, Plus, Database, FileUp, GitBranch, Cpu, ArrowLeft, Save, Settings, Layers, Calculator, ArrowRight, MousePointer2, Link as LinkIcon, Trash2, Microscope, AlertTriangle, CheckCircle2, Factory, Truck, Coins, RefreshCw, Send, Bot, User, Maximize2, X, FileText, Activity, Minimize2, Search, History, Calendar, MessageSquare, Target, Shield, Scale, FileOutput, ChevronRight } from 'lucide-react';

// --- Mock Data ---
const MOCK_CHART_DATA = [
  { day: 'T+1', baseline: 100, aggressive: 102, conservative: 98 },
  { day: 'T+2', baseline: 95, aggressive: 105, conservative: 94 },
  { day: 'T+3', baseline: 80, aggressive: 98, conservative: 92 },
  { day: 'T+4', baseline: 60, aggressive: 85, conservative: 88 },
  { day: 'T+5', baseline: 85, aggressive: 95, conservative: 85 },
  { day: 'T+6', baseline: 90, aggressive: 110, conservative: 82 },
];

const KPI_DATA = [
  { subject: '产能利用率', A: 85, B: 98, C: 70, fullMark: 100 },
  { subject: '交付准时率', A: 90, B: 75, C: 99, fullMark: 100 },
  { subject: '利润率', A: 60, B: 90, C: 50, fullMark: 100 },
  { subject: '供应链韧性', A: 70, B: 40, C: 95, fullMark: 100 },
  { subject: '碳排放合规', A: 80, B: 60, C: 90, fullMark: 100 },
];

// Enhanced Root Cause Data Structure
interface TraceNode {
  id: number;
  label: string;
  type: string;
  icon: any;
  status: 'RISK' | 'UNCERTAIN' | 'NORMAL';
  timestamp: string;
  description: string;
  metrics: { label: string; value: string; trend?: 'up' | 'down' }[];
  evidence: string[]; // Mock logs or data sources
}

// 1. Traceability Data for BASELINE Strategy (Supply Chain Shock)
const TRACE_BASELINE: TraceNode[] = [
  { 
    id: 1, label: '外部事件: 澳洲锂矿罢工', type: '外部事件', icon: AlertTriangle, status: 'RISK', timestamp: '2024-08-10 09:30',
    description: '监测到上游核心供应商 Pilbara Minerals 发生劳资纠纷引发的停工事件，预计持续 2 周。',
    metrics: [{ label: '置信度', value: '98.5%' }, { label: '预计停工', value: '14 天', trend: 'up' }],
    evidence: ['Global News API', 'Supplier Email #9921']
  },
  { 
    id: 2, label: '供应传导: 碳酸锂缺货', type: '传导影响', icon: Truck, status: 'RISK', timestamp: '2024-08-10 14:15',
    description: '基于现有库存水位 (3.2天) 推演，预计 T+3 日出现断供缺口。',
    metrics: [{ label: '当前库存', value: '3.2 天', trend: 'down' }, { label: '缺口预估', value: '12.5 吨' }],
    evidence: ['ERP Snapshot', 'Logistics Track-Trace']
  },
  { 
    id: 3, label: '生产瓶颈: 搅拌机待料', type: '生产问题', icon: Factory, status: 'RISK', timestamp: '2024-08-13 08:00',
    description: '#2 正极搅拌机组将进入强制待机状态，导致电极片产出中断。',
    metrics: [{ label: 'OEE 预测', value: '45.0%', trend: 'down' }, { label: '停机成本', value: '¥ 12k/h' }],
    evidence: ['APS Simulation', 'Equipment Forecast']
  },
  { 
    id: 4, label: '最终后果: 交付延期', type: '最终后果', icon: TrendingUp, status: 'UNCERTAIN', timestamp: '2024-08-20',
    description: 'Q3 重点客户（Tesla Energy）订单预计延期 5 天，面临违约风险。',
    metrics: [{ label: '延期天数', value: '+5 天', trend: 'up' }, { label: '违约金', value: '¥ 500k' }],
    evidence: ['Sales Order System', 'SLA Database']
  }
];

// 2. Traceability Data for AGGRESSIVE Strategy (Quality/Equipment Risk)
const TRACE_AGGRESSIVE: TraceNode[] = [
    { 
      id: 1, label: '策略输入: 极限提速', type: '决策输入', icon: Activity, status: 'NORMAL', timestamp: '策略启动',
      description: '将涂布速度提升至 85m/min (设计上限 90m/min)，并压缩烘箱温区缓冲时间。',
      metrics: [{ label: '目标产能', value: '+18%' }, { label: '设备负荷', value: '95%' }],
      evidence: ['Strategy Config: Aggressive-V2']
    },
    { 
      id: 2, label: '设备响应: 辊压机过热', type: '设备响应', icon: Cpu, status: 'RISK', timestamp: 'T+4 小时',
      description: '高负荷运转导致 #4 辊压机液压油温持续升高，超出最佳工作区间 (55℃)。',
      metrics: [{ label: '油温', value: '62℃', trend: 'up' }, { label: '压力波动', value: '±3%' }],
      evidence: ['IoT Sensor: Temp-Hydraulic-04']
    },
    { 
      id: 3, label: '质量隐患: 极片断带', type: '质量风险', icon: AlertTriangle, status: 'RISK', timestamp: 'T+12 小时',
      description: '由于张力控制不稳定与热效应叠加，极片断带概率指数级上升。',
      metrics: [{ label: '断带概率', value: '高' }, { label: 'MTBF预测', value: '4.5h' }],
      evidence: ['Quality Prediction Model', 'Tension Sensor Log']
    },
    { 
      id: 4, label: '最终后果: 产线停机', type: '最终后果', icon: X, status: 'RISK', timestamp: 'T+2 天',
      description: '非计划性停机维修风险极高，虽然初期产量提升，但综合 OEE 可能不升反降。',
      metrics: [{ label: '停机风险', value: '85%' }, { label: '维修耗时', value: '4-8h' }],
      evidence: ['Predictive Maintenance Engine']
    }
  ];

// 3. Traceability Data for CONSERVATIVE Strategy (Financial/Inventory Risk)
const TRACE_CONSERVATIVE: TraceNode[] = [
    { 
      id: 1, label: '策略输入: 安全库存倍增', type: '决策输入', icon: Shield, status: 'NORMAL', timestamp: '策略启动',
      description: '将原材料安全库存水位从 3 天提升至 14 天，引入二级高价供应商。',
      metrics: [{ label: '库存周转', value: '低' }, { label: '供应满足', value: '100%' }],
      evidence: ['Strategy Config: Conservative-Safe']
    },
    { 
      id: 2, label: '财务传导: 现金流占用', type: '财务传导', icon: Coins, status: 'UNCERTAIN', timestamp: 'T+1 周',
      description: '大量采购资金被库存占用，导致当月经营性现金流吃紧，可能影响设备技改付款。',
      metrics: [{ label: '资金占用', value: '¥ 12M', trend: 'up' }, { label: '流动比率', value: '0.8' }],
      evidence: ['Financial Forecast Module']
    },
    { 
      id: 3, label: '仓储瓶颈: 库位爆仓', type: '物流瓶颈', icon: Database, status: 'RISK', timestamp: 'T+2 周',
      description: '现有恒温恒湿仓库利用率将达到 110%，需启用临时外租仓库，增加管理难度。',
      metrics: [{ label: '库容率', value: '110%', trend: 'up' }, { label: '额外租金', value: '¥ 50k/月' }],
      evidence: ['WMS Capacity Simulation']
    },
    { 
      id: 4, label: '最终后果: 利润率下滑', type: '最终后果', icon: TrendingUp, status: 'NORMAL', timestamp: '月末',
      description: '虽然保障了交付零延期，但由于持有成本和采购成本上升，单品毛利下降 8%。',
      metrics: [{ label: '毛利影响', value: '-8%', trend: 'down' }, { label: '交付率', value: '100%' }],
      evidence: ['Profitability Analysis']
    }
  ];

// 4. Traceability Data for DRY ELECTRODE (Specific to HIS-003)
const TRACE_DRY_ELECTRODE_BASELINE: TraceNode[] = [
  { 
    id: 1, label: '工艺输入: 干法中试线启动', type: '工艺变更', icon: Factory, status: 'NORMAL', timestamp: '2024-07-20 09:00',
    description: '启动 #4 实验线进行干法电极涂布测试，设定幅宽 600mm，速度 30m/min。',
    metrics: [{ label: '目标良率', value: '85%' }, { label: '设计产能', value: '2 GWh' }],
    evidence: ['Pilot Run Plan v1.0', 'Equipment Log']
  },
  { 
    id: 2, label: '材料响应: 粘结剂纤维化', type: '材料问题', icon: Microscope, status: 'RISK', timestamp: '2024-07-20 14:30',
    description: 'PTFE 粘结剂在三辊压延过程中纤维化程度不均，导致自支撑膜强度不足。',
    metrics: [{ label: '剥离强度', value: '0.8 N/cm', trend: 'down' }, { label: '厚度CPK', value: '0.92' }],
    evidence: ['SEM Analysis Report', 'Tension Test Data']
  },
  { 
    id: 3, label: '生产瓶颈: 掉粉与断带', type: '生产异常', icon: AlertTriangle, status: 'RISK', timestamp: '2024-07-21 10:15',
    description: '由于膜强度不足，收卷过程中发生多次断带，且辊压后极片表面掉粉严重。',
    metrics: [{ label: '断带次数', value: '12次/天', trend: 'up' }, { label: 'OEE', value: '35%' }],
    evidence: ['Shift Report', 'Defect Inspection Log']
  },
  { 
    id: 4, label: '最终后果: 成本超支', type: '财务影响', icon: Coins, status: 'UNCERTAIN', timestamp: '2024-07-25',
    description: '若按当前良率 (70%) 全面替代湿法工艺，Q3 极片制造成本将上升 45%，导致亏损。',
    metrics: [{ label: '单瓦时成本', value: '+0.12元', trend: 'up' }, { label: '良率缺口', value: '-15%' }],
    evidence: ['Cost Modeling Report', 'Financial Impact Analysis']
  }
];

const SCENARIO_TRACE_MAP: Record<string, TraceNode[]> = {
    'BASELINE': TRACE_BASELINE,
    'AGGRESSIVE': TRACE_AGGRESSIVE,
    'CONSERVATIVE': TRACE_CONSERVATIVE
};

// --- History Data ---
interface HistoryRecord {
    id: string;
    title: string;
    date: string;
    description: string;
    selectedStrategy: '基准' | '激进' | '保守';
    outcome: string;
    messages: { role: 'AI' | 'USER', content: string }[];
}

const MOCK_HISTORY: HistoryRecord[] = [
    {
        id: 'HIS-004',
        title: 'Q3 产能与供应风险评估',
        date: '2024-08-12',
        description: '基于实时监测到的澳洲锂矿罢工事件，推演碳酸锂缺货对 Q3 产能的影响。',
        selectedStrategy: '保守',
        outcome: '采纳保守策略：紧急提升原材料安全库存至 14 天，虽然资金占用增加，但规避了 T+3 断供风险。',
        messages: [
            { role: 'AI', content: '警报：监测到上游核心供应商 Pilbara Minerals 发生罢工，预计影响时长 2 周。' },
            { role: 'USER', content: '如果维持当前生产计划（基准策略），会有什么后果？' },
            { role: 'AI', content: '推演显示：基准策略下，预计 T+3 日出现原料缺口，导致 #2 产线停机，Q3 重点订单延期风险极高 (92%)。' },
            { role: 'USER', content: '如果采用激进策略提速生产呢？' },
            { role: 'AI', content: '激进策略虽然初期产出增加，但无法解决缺料问题，且设备过热风险上升至 85%。' },
            { role: 'USER', content: '那只能选保守策略了，看看财务影响。' },
            { role: 'AI', content: '保守策略：资金占用增加 1200万，但能确保交付。建议采纳。' }
        ]
    },
    {
        id: 'HIS-001',
        title: 'Q2 产能扩充压力测试',
        date: '2024-06-15',
        description: '模拟在订单激增 30% 情况下，现有三条产线的最大承载能力及瓶颈工序。',
        selectedStrategy: '激进',
        outcome: '采纳激进策略但增加了预防性维护频次。实际产出提升 22%，未发生重大停机。',
        messages: [
            { role: 'AI', content: '推演显示 #2 涂布机是主要瓶颈。激进策略下，烘箱温度控制风险较高。' },
            { role: 'USER', content: '如果增加夜班维保人员呢？' },
            { role: 'AI', content: '计算中... 增加维保后，设备故障风险降低 15%，综合 OEE 可达 88%。' }
        ]
    },
    {
        id: 'HIS-002',
        title: '电解液供应中断演练',
        date: '2024-07-02',
        description: '验证当主要供应商 A 厂发生不可抗力断供时，B/C 备选供应商的切换速度与成本影响。',
        selectedStrategy: '保守',
        outcome: '建立了 14 天安全库存机制，并锁定了 B 供应商 20% 的产能份额。',
        messages: [
            { role: 'AI', content: '若 A 厂断供，切换 B 厂需 5 天认证期，期间将停产。' },
            { role: 'USER', content: '模拟提前进行 B 厂小批量试产。' },
            { role: 'AI', content: '认证期缩短至 1 天。建议采用保守策略，提前储备库存。' }
        ]
    },
    {
        id: 'HIS-003',
        title: '新工艺 (干法电极) 导入评估',
        date: '2024-07-20',
        description: '评估引入干法电极工艺对良率爬坡期成本的影响范围。',
        selectedStrategy: '基准',
        outcome: '决定维持现有湿法工艺，小规模试运行干法线。',
        messages: [
            { role: 'AI', content: '干法工艺初期良率仅 70%，完全替代会导致 Q3 亏损。' },
            { role: 'USER', content: '查看基准策略下的财务表现。' }
        ]
    }
];

// --- Types ---
type NodeType = 'SOURCE' | 'MODEL' | 'LOGIC' | 'ACTION';

interface SimNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label: string;
  config: Record<string, any>;
}

interface SimEdge {
  id: string;
  source: string;
  target: string;
}

export const SimulationEngine: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'WIZARD' | 'ANALYSIS' | 'HISTORY_DETAIL'>('DASHBOARD');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null);

  // Analysis State
  const [activeStrategy, setActiveStrategy] = useState<'BASELINE' | 'AGGRESSIVE' | 'CONSERVATIVE'>('BASELINE');

  // Traceability State
  const [selectedTraceNode, setSelectedTraceNode] = useState<TraceNode>(TRACE_BASELINE[0]);
  const [isTraceExpanded, setIsTraceExpanded] = useState(false);

  // Chat/Copilot State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'AI', content: '推演已完成。激进策略虽然能提升 15% 的预期收益，但在 T+4 天面临极高的缺料风险。建议结合“库存置换”方案。' }
  ]);

  // Designer State
  const [nodes, setNodes] = useState<SimNode[]>([
      { id: 'n1', type: 'SOURCE', x: 50, y: 100, label: '输入: 电芯批次数据', config: { entity: 'E-Cell-280', filter: 'status=active' } },
      { id: 'n2', type: 'MODEL', x: 300, y: 100, label: '模型: 容量衰减预测', config: { model: 'v2.4-LSTM', version: 'latest' } },
      { id: 'n3', type: 'LOGIC', x: 550, y: 100, label: '规则: 报废判定', config: { condition: 'capacity < 80%' } }
  ]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper to get trace nodes based on history ID and strategy
  const getCurrentTraceData = () => {
      // Special handling for the Dry Electrode scenario
      if (selectedHistory?.id === 'HIS-003' && activeStrategy === 'BASELINE') {
          return TRACE_DRY_ELECTRODE_BASELINE;
      }
      // Default fallback to scenario maps
      return SCENARIO_TRACE_MAP[activeStrategy] || TRACE_BASELINE;
  };
  
  // Effect to update Trace Node when Strategy Changes
  useEffect(() => {
    const nodes = getCurrentTraceData();
    setSelectedTraceNode(nodes[0]);
  }, [activeStrategy, selectedHistory]);

  // Effect to sync state when entering History Detail
  useEffect(() => {
      if (viewMode === 'HISTORY_DETAIL' && selectedHistory) {
          // Map selected strategy text to Enum Key
          const map: Record<string, 'BASELINE' | 'AGGRESSIVE' | 'CONSERVATIVE'> = {
              '基准': 'BASELINE',
              '激进': 'AGGRESSIVE',
              '保守': 'CONSERVATIVE'
          };
          const strategyKey = map[selectedHistory.selectedStrategy] || 'BASELINE';
          setActiveStrategy(strategyKey);
          setMessages(selectedHistory.messages);
      }
  }, [viewMode, selectedHistory]);

  // --- Handlers ---
  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    setMessages([...messages, { role: 'USER', content: chatInput }]);
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'AI', content: '正在重新计算敏感性分析... 结果显示如果引入二级供应商，风险系数可降低至 25%。' }]);
    }, 1000);
    setChatInput('');
  };

  // --- Sub-Components for Traceability ---

  const renderTraceDetailContent = (node: TraceNode, isFull = false) => (
      <div className={`animate-in fade-in duration-300 ${isFull ? 'p-6' : 'p-0'}`}>
          <div className="flex justify-between items-start mb-4">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">{node.type}</span>
                      <span className="text-xs text-slate-500 font-mono">{node.timestamp}</span>
                  </div>
                  <h3 className={`font-medium text-white ${isFull ? 'text-2xl' : 'text-lg'}`}>{node.label}</h3>
              </div>
              <Badge status={node.status === 'RISK' ? StatusLevel.RISK : node.status === 'UNCERTAIN' ? StatusLevel.UNCERTAIN : StatusLevel.VERIFIED} />
          </div>
          
          <div className={`text-slate-400 leading-relaxed mb-6 ${isFull ? 'text-base' : 'text-sm'}`}>
              {node.description}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              {node.metrics.map((m, i) => (
                  <div key={i} className="bg-slate-900/50 p-3 rounded border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase mb-1">{m.label}</div>
                      <div className="flex items-end gap-2">
                          <span className={`font-mono font-medium text-slate-200 ${isFull ? 'text-2xl' : 'text-xl'}`}>{m.value}</span>
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

  // --- View 2: Create Wizard ---
  const renderWizard = () => (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <Button variant="ghost" onClick={() => setViewMode('DASHBOARD')} className="w-10 h-10 p-0 justify-center rounded-full border border-slate-700">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h2 className="text-xl text-white font-medium">创建新推演模拟</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className={`flex items-center gap-1 ${wizardStep >= 1 ? 'text-cyan-400' : ''}`}>
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">1</div> 定义场景
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={`flex items-center gap-1 ${wizardStep >= 2 ? 'text-cyan-400' : ''}`}>
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">2</div> 调整参数
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={`flex items-center gap-1 ${wizardStep >= 3 ? 'text-cyan-400' : ''}`}>
                         <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">3</div> 确认运行
                    </span>
                </div>
            </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 bg-slate-950 rounded border border-slate-800 p-8 overflow-y-auto">
             {wizardStep === 1 && (
                 <div className="max-w-xl space-y-6 animate-in slide-in-from-right-4 duration-300">
                     <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">模拟任务名称</label>
                         <input type="text" placeholder="例如: 2024 Q4 供应链压力测试" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">描述</label>
                         <textarea rows={4} placeholder="描述模拟的目的、假设条件及预期目标..." className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">基准模型版本</label>
                         <select className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none">
                             <option>Neural-SC-v4 (Current Production)</option>
                             <option>Neural-SC-v3.5 (Stable)</option>
                         </select>
                     </div>
                 </div>
             )}

             {wizardStep === 2 && (
                 <div className="max-w-2xl space-y-8 animate-in slide-in-from-right-4 duration-300">
                     <Card title="关键变量调节 (Sensitivity Factors)">
                         <div className="space-y-6">
                             <div>
                                 <div className="flex justify-between mb-2">
                                     <label className="text-sm text-slate-300">市场需求波动率</label>
                                     <span className="text-sm font-mono text-cyan-400">+15%</span>
                                 </div>
                                 <input type="range" className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer" />
                                 <div className="flex justify-between text-xs text-slate-500 mt-1">
                                     <span>-50%</span>
                                     <span>+50%</span>
                                 </div>
                             </div>
                             <div>
                                 <div className="flex justify-between mb-2">
                                     <label className="text-sm text-slate-300">原材料供应稳定性</label>
                                     <span className="text-sm font-mono text-red-400">Low (Risk)</span>
                                 </div>
                                 <input type="range" className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer" />
                             </div>
                             <div>
                                 <div className="flex justify-between mb-2">
                                     <label className="text-sm text-slate-300">产线设备OEE假设</label>
                                     <span className="text-sm font-mono text-emerald-400">95% (Optimistic)</span>
                                 </div>
                                 <input type="range" className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer" />
                             </div>
                         </div>
                     </Card>
                 </div>
             )}

             {wizardStep === 3 && (
                 <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in zoom-in-95 duration-300">
                     <div className="w-24 h-24 rounded-full bg-cyan-900/10 border border-cyan-500/30 flex items-center justify-center mb-6 animate-pulse">
                         <Cpu className="w-12 h-12 text-cyan-400" />
                     </div>
                     <h3 className="text-xl text-white font-medium mb-2">准备就绪</h3>
                     <p className="text-sm max-w-md text-center mb-8">
                         即将基于配置的参数启动并行推演计算。预计耗时 15-30 秒，将生成 基准/激进/保守 三种策略的对比报告。
                     </p>
                 </div>
             )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            {wizardStep > 1 && (
                <Button variant="secondary" onClick={() => setWizardStep(prev => Math.max(1, prev - 1) as any)}>上一步</Button>
            )}
            {wizardStep < 3 ? (
                <Button onClick={() => setWizardStep(prev => Math.min(3, prev + 1) as any)}>下一步</Button>
            ) : (
                <Button className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" onClick={() => { setViewMode('ANALYSIS'); setActiveStrategy('BASELINE'); }}>
                    <Play className="w-4 h-4 mr-2" /> 启动推演引擎
                </Button>
            )}
        </div>
    </div>
  );

  // --- View 1: Dashboard (Overview) ---
  const renderDashboard = () => (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-300">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-light text-white flex items-center gap-2">
            <TrendingUp className="text-cyan-500" />
            推演模拟引擎 <span className="text-slate-500 text-base">/ Simulation Engine</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">基于当前实时数据快照 (快照-1042) 进行多情景并行推演</p>
        </div>
        <div className="flex gap-3">
             <Button variant="secondary" onClick={() => { setViewMode('WIZARD'); setWizardStep(1); }}>
                <Plus className="w-4 h-4" /> 创建新模拟
             </Button>
             <Button className="pl-6 pr-6" onClick={() => { setActiveStrategy('BASELINE'); setViewMode('ANALYSIS'); }}>
                <Play className="w-4 h-4 fill-current" /> 执行全量推演
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
         <div className="col-span-12 grid grid-cols-4 gap-4 h-32">
             {MOCK_SCENARIOS.map((scenario) => (
                <Card 
                    key={scenario.id} 
                    className="cursor-pointer hover:border-cyan-500/50 transition-all group relative overflow-hidden"
                    onClick={() => { setSelectedScenarioId(scenario.id); setActiveStrategy('BASELINE'); setViewMode('ANALYSIS'); }}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20">
                        <Microscope className="w-16 h-16 text-cyan-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-slate-200 text-sm">{scenario.name}</span>
                            <Badge status={scenario.riskScore > 50 ? StatusLevel.RISK : StatusLevel.VERIFIED} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                             <div>
                                <div className="text-[10px] text-slate-500 uppercase">预期收益</div>
                                <div className="text-lg font-mono text-emerald-400">{scenario.predictedOutcome}%</div>
                             </div>
                             <div>
                                <div className="text-[10px] text-slate-500 uppercase">风险系数</div>
                                <div className={`text-lg font-mono ${scenario.riskScore > 50 ? 'text-red-400' : 'text-slate-200'}`}>{scenario.riskScore}</div>
                             </div>
                        </div>
                    </div>
                </Card>
             ))}
             <div onClick={() => { setViewMode('WIZARD'); setWizardStep(1); }} className="border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-500 hover:border-cyan-500/30 cursor-pointer">
                 <Plus className="w-8 h-8 mb-2" />
                 <span>添加对比情景</span>
             </div>
         </div>

         <div className="col-span-12 flex-1 min-h-0">
             <Card title="历史推演记录" className="h-full flex flex-col">
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {MOCK_HISTORY.map(history => (
                        <div 
                            key={history.id}
                            className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between hover:bg-slate-800 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-950 rounded border border-slate-800 group-hover:text-cyan-400 transition-colors text-slate-500">
                                    <History className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-white mb-0.5">{history.title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {history.date}</span>
                                        <span className="flex items-center gap-1"><Target className="w-3 h-3"/> 最终策略: {history.selectedStrategy}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-xs text-slate-400 max-w-md line-clamp-1">{history.outcome}</p>
                                <Button 
                                    className="h-8 text-xs px-3 bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 border border-slate-700" 
                                    onClick={() => { setSelectedHistory(history); setViewMode('HISTORY_DETAIL'); }}
                                >
                                    详情 <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    ))}
                 </div>
             </Card>
         </div>
      </div>
    </div>
  );

  // --- Reused View: The "PNG File Interface" (Analysis View) ---
  // This function is now used for both active analysis AND history detail.
  // It checks `viewMode` or `selectedHistory` to decide if it's read-only or active.
  const renderRichAnalysisView = () => {
      // Access trace nodes via helper to support dynamic switching
      const currentTraceNodes = getCurrentTraceData();

      return (
      <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300 relative">
          {/* Enhanced Traceability Modal */}
          {isTraceExpanded && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                      <div>
                          <h2 className="text-2xl text-white font-light flex items-center gap-3">
                              <Activity className="text-cyan-500" /> 
                              全链路风险归因溯源 <span className="text-slate-500">/ Full-Stack Root Cause Analysis</span>
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-sm text-slate-400">当前策略视角:</span>
                             <Badge status={StatusLevel.PROCESSING} className="text-cyan-400 border-cyan-500/30 bg-cyan-900/20 px-3">
                                {activeStrategy === 'BASELINE' ? '基准' : activeStrategy === 'AGGRESSIVE' ? '激进' : '保守'} 策略
                             </Badge>
                          </div>
                      </div>
                      <Button variant="ghost" onClick={() => setIsTraceExpanded(false)}>
                          <X className="w-6 h-6 text-slate-400 hover:text-white" />
                      </Button>
                  </div>

                  <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
                      {/* Left: Vertical Timeline/Tree */}
                      <div className="col-span-4 border-r border-slate-800 pr-8 overflow-y-auto">
                           <div className="space-y-8 relative">
                               {/* Vertical Line */}
                               <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-800 -z-10"></div>
                               
                               {currentTraceNodes.map((node, idx) => (
                                   <div 
                                      key={node.id} 
                                      onClick={() => setSelectedTraceNode(node)}
                                      className={`relative flex items-start gap-4 cursor-pointer group ${selectedTraceNode.id === node.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                   >
                                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-slate-950 transition-all ${
                                           selectedTraceNode.id === node.id 
                                             ? 'border-cyan-500 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110' 
                                             : 'border-slate-700 text-slate-500 group-hover:border-slate-500'
                                        }`}>
                                            <node.icon className="w-5 h-5" />
                                        </div>
                                        <div className={`p-4 rounded-lg border flex-1 transition-all ${
                                            selectedTraceNode.id === node.id 
                                              ? 'bg-cyan-950/20 border-cyan-500/50' 
                                              : 'bg-slate-900 border-slate-800 group-hover:bg-slate-800'
                                        }`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-mono text-slate-500">{node.timestamp}</span>
                                                <Badge status={node.status === 'RISK' ? StatusLevel.RISK : node.status === 'NORMAL' ? StatusLevel.VERIFIED : StatusLevel.UNCERTAIN} />
                                            </div>
                                            <h4 className="text-white font-medium mb-1">{node.label}</h4>
                                            <p className="text-xs text-slate-400 line-clamp-2">{node.description}</p>
                                        </div>
                                   </div>
                               ))}
                           </div>
                      </div>

                      {/* Right: Detailed View */}
                      <div className="col-span-8 bg-slate-900/50 rounded-xl border border-slate-800 overflow-y-auto">
                          {renderTraceDetailContent(selectedTraceNode, true)}
                      </div>
                  </div>
              </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setViewMode('DASHBOARD')} className="w-10 h-10 p-0 justify-center rounded-full border border-slate-700">
                      <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                      <h2 className="text-xl text-white font-medium flex items-center gap-2">
                          {selectedHistory ? selectedHistory.title : '情景推演分析：Q3 产能与供应风险评估'}
                          <Badge status={selectedHistory ? StatusLevel.VERIFIED : StatusLevel.PROCESSING} />
                      </h2>
                      <div className="text-xs text-slate-500 mt-1 flex gap-4 font-mono">
                          <span>模拟ID: {selectedHistory ? selectedHistory.id : '2024-08-12-X99'}</span>
                          <span>基础模型: Neural-SC-v4</span>
                          <span>置信区间: ±4.2%</span>
                      </div>
                  </div>
              </div>
              <div className="flex gap-2">
                  <Button variant="secondary"><FileUp className="w-4 h-4 mr-2"/> 导出报告</Button>
                  {selectedHistory ? (
                      <Button className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50"><CheckCircle2 className="w-4 h-4 mr-2"/> 采纳建议策略</Button>
                  ) : (
                      <Button><CheckCircle2 className="w-4 h-4 mr-2"/> 采纳建议策略</Button>
                  )}
              </div>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-y-auto pr-1">
              {/* Left Column: Data & Comparison */}
              <div className="col-span-8 space-y-6">
                  {/* Strategy Comparison Cards (Selectable) */}
                  <div className="grid grid-cols-3 gap-4">
                      <div 
                        onClick={() => setActiveStrategy('BASELINE')}
                        className={`p-4 border rounded-lg relative overflow-hidden cursor-pointer transition-all ${activeStrategy === 'BASELINE' ? 'bg-slate-800 border-slate-500 shadow-md ring-1 ring-slate-400' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
                      >
                          <div className="text-xs text-slate-500 uppercase mb-1">基准策略 (Baseline)</div>
                          <div className="text-2xl font-mono text-slate-200">¥ 42.5M</div>
                          <div className="text-xs text-slate-400 mt-1">风险: 低 | 交付: 98%</div>
                          <div className={`absolute top-0 right-0 w-1 h-full bg-slate-500 ${activeStrategy === 'BASELINE' ? 'opacity-100' : 'opacity-50'}`}></div>
                      </div>
                      <div 
                        onClick={() => setActiveStrategy('AGGRESSIVE')}
                        className={`p-4 border rounded-lg relative overflow-hidden cursor-pointer transition-all ${activeStrategy === 'AGGRESSIVE' ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400' : 'bg-slate-900/50 border-cyan-500/30 hover:bg-cyan-900/10'}`}
                      >
                          <div className="text-xs text-cyan-400 uppercase mb-1 font-bold">激进策略 (Aggressive)</div>
                          <div className="text-2xl font-mono text-white">¥ 58.2M</div>
                          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> 预期收益 +36%</div>
                          <div className={`absolute top-0 right-0 w-1 h-full bg-cyan-500 ${activeStrategy === 'AGGRESSIVE' ? 'opacity-100' : 'opacity-50'}`}></div>
                      </div>
                      <div 
                        onClick={() => setActiveStrategy('CONSERVATIVE')}
                        className={`p-4 border rounded-lg relative overflow-hidden cursor-pointer transition-all ${activeStrategy === 'CONSERVATIVE' ? 'bg-emerald-900/20 border-emerald-500 shadow-md ring-1 ring-emerald-400' : 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50'}`}
                      >
                          <div className="text-xs text-slate-500 uppercase mb-1">保守策略 (Conservative)</div>
                          <div className="text-2xl font-mono text-slate-200">¥ 38.1M</div>
                          <div className="text-xs text-amber-400 mt-1">风险: 极低 | 成本: +12%</div>
                          <div className={`absolute top-0 right-0 w-1 h-full bg-emerald-600 ${activeStrategy === 'CONSERVATIVE' ? 'opacity-100' : 'opacity-50'}`}></div>
                      </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-2 gap-4 h-[320px]">
                      <Card title="KPI 多维雷达对比">
                          <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={KPI_DATA}>
                                  <PolarGrid stroke="#334155" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                  <Radar name="基准" dataKey="A" stroke="#94a3b8" fill="#94a3b8" fillOpacity={activeStrategy === 'BASELINE' ? 0.6 : 0.1} />
                                  <Radar name="激进" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={activeStrategy === 'AGGRESSIVE' ? 0.6 : 0.1} />
                                  <Radar name="保守" dataKey="C" stroke="#10b981" fill="#10b981" fillOpacity={activeStrategy === 'CONSERVATIVE' ? 0.6 : 0.1} />
                                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                              </RadarChart>
                          </ResponsiveContainer>
                      </Card>
                      <Card title="关键指标时序推演 (产能利用率)">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={MOCK_CHART_DATA}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                  <YAxis stroke="#94a3b8" fontSize={10} domain={[50, 120]} />
                                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                                  <Line type="monotone" dataKey="baseline" name="基准" stroke={activeStrategy === 'BASELINE' ? '#fff' : '#94a3b8'} dot={false} strokeWidth={activeStrategy === 'BASELINE' ? 3 : 1} opacity={activeStrategy === 'BASELINE' ? 1 : 0.5} />
                                  <Line type="monotone" dataKey="aggressive" name="激进" stroke={activeStrategy === 'AGGRESSIVE' ? '#22d3ee' : '#06b6d4'} dot={false} strokeWidth={activeStrategy === 'AGGRESSIVE' ? 3 : 1} opacity={activeStrategy === 'AGGRESSIVE' ? 1 : 0.5} />
                                  <Line type="monotone" dataKey="conservative" name="保守" stroke={activeStrategy === 'CONSERVATIVE' ? '#34d399' : '#10b981'} dot={false} strokeWidth={activeStrategy === 'CONSERVATIVE' ? 3 : 1} opacity={activeStrategy === 'CONSERVATIVE' ? 1 : 0.5} />
                              </LineChart>
                          </ResponsiveContainer>
                      </Card>
                  </div>

                  {/* Improved Root Cause Traceability */}
                  <Card 
                    title={`全链路风险归因溯源 (Traceability) - ${activeStrategy === 'BASELINE' ? '基准' : activeStrategy === 'AGGRESSIVE' ? '激进' : '保守'} 策略`}
                    className="flex-1 flex flex-col min-h-[300px]"
                    action={
                        <Button variant="ghost" className="h-6 w-6 p-0" onClick={() => setIsTraceExpanded(true)}>
                            <Maximize2 className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
                        </Button>
                    }
                  >
                      <div className="flex-1 flex flex-col gap-4">
                          {/* Visual Chain */}
                          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded border border-slate-800 relative overflow-x-auto">
                               {/* SVG Connector Line */}
                               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>

                               {currentTraceNodes.map((node, index) => (
                                   <React.Fragment key={node.id}>
                                       <div 
                                            onClick={() => setSelectedTraceNode(node)}
                                            className={`relative flex flex-col items-center group cursor-pointer transition-all ${selectedTraceNode.id === node.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                                       >
                                           <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-slate-900 z-10 transition-all ${
                                               selectedTraceNode.id === node.id
                                                ? 'border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                                : (node.status === 'RISK' ? 'border-red-500 text-red-500' : node.status === 'NORMAL' ? 'border-emerald-500 text-emerald-500' : 'border-slate-600 text-slate-500')
                                           }`}>
                                               <node.icon className="w-5 h-5" />
                                           </div>
                                           <div className="mt-2 text-center w-24">
                                               <div className="text-[10px] text-slate-500 font-mono mb-0.5">{node.type}</div>
                                               <div className={`text-xs font-medium truncate ${selectedTraceNode.id === node.id ? 'text-cyan-400' : 'text-slate-300'}`}>{node.label}</div>
                                           </div>
                                       </div>
                                       {index < currentTraceNodes.length - 1 && (
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
                               {renderTraceDetailContent(selectedTraceNode, false)}
                          </div>
                      </div>
                  </Card>
              </div>

              {/* Right Column: Expert Context & Copilot */}
              <div className="col-span-4 flex flex-col gap-6">
                  {/* Expert Context Data */}
                  <Card title="决策边界条件 (Boundary Conditions)">
                      <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                              <span className="text-xs text-slate-400">原材料库存 (碳酸锂)</span>
                              <span className="text-sm font-mono text-red-400">低 (3.2天)</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                              <span className="text-xs text-slate-400">产线 #2 OEE</span>
                              <span className="text-sm font-mono text-emerald-400">92.5%</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                              <span className="text-xs text-slate-400">Q3 订单交付死线</span>
                              <span className="text-sm font-mono text-slate-200">T+15 天</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                              <span className="text-xs text-slate-400">最大外协预算</span>
                              <span className="text-sm font-mono text-slate-200">¥ 500k</span>
                          </div>
                      </div>
                  </Card>

                  {/* HCI / Copilot */}
                  <Card title="AI 智囊助手 (Copilot)" className="flex-1 flex flex-col min-h-0 border-cyan-500/20 shadow-[0_0_20px_rgba(8,145,178,0.05)]">
                      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-2 scrollbar-thin">
                          {messages.map((msg, i) => (
                              <div key={i} className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'AI' ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-400' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                                      {msg.role === 'AI' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                  </div>
                                  <div className={`p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'AI' ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-cyan-900/30 text-cyan-100 border border-cyan-500/30'}`}>
                                      {msg.content}
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="space-y-2">
                          <div className="flex gap-2">
                              <button className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400 transition-colors" onClick={() => setChatInput('为什么激进策略风险高？')}>为什么激进策略风险高？</button>
                              <button className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400 transition-colors" onClick={() => setChatInput('模拟引入二级供应商')}>模拟引入二级供应商</button>
                          </div>
                          <div className="flex gap-2 relative">
                              <input 
                                  type="text" 
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder="向推演引擎提问..."
                                  className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 focus:outline-none pl-3 pr-10"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <button 
                                onClick={handleSendMessage}
                                className="absolute right-1 top-1 p-1.5 text-cyan-500 hover:text-cyan-400 transition-colors"
                              >
                                  <Send className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </Card>
              </div>
          </div>
      </div>
  );};

  // --- Main Switch ---
  // Reusing the rich view for history detail now
  if (viewMode === 'HISTORY_DETAIL') return renderRichAnalysisView();
  if (viewMode === 'ANALYSIS') return renderRichAnalysisView();
  if (viewMode === 'WIZARD') return renderWizard();
  return renderDashboard();
};
