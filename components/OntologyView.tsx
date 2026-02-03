
import React, { useState, useEffect } from 'react';
import { Entity, StatusLevel } from '../types';
import { MOCK_ENTITIES, MOCK_ENTITY_DETAILS_MAP } from '../constants';
import { Badge, Button, Card, getStatusColor } from './UI';
import { Search, GitBranch, Database, ShieldAlert, Layers, ArrowRight, Activity, Plus, ArrowLeft, Table, Key, Type, Check, Settings2, FileText, Fingerprint } from 'lucide-react';

interface OntologyViewProps {
  onNavigate: (view: any) => void; 
}

// Mock Data Sources for the Wizard
const MOCK_DATASETS = [
    { id: 'dw.mes.coating_logs', name: 'MES_Coating_Machine_Logs_V2', rows: '14.2M', update: 'Real-time' },
    { id: 'dw.lims.sample_tests', name: 'LIMS_Material_Sample_Results', rows: '850K', update: 'Daily' },
    { id: 'dw.erp.orders', name: 'ERP_Production_Orders_2024', rows: '2.1M', update: 'Hourly' },
];

const MOCK_COLUMNS = [
    { name: 'log_id', type: 'String', suggestion: 'ID' },
    { name: 'machine_code', type: 'String', suggestion: 'Property' },
    { name: 'timestamp', type: 'Timestamp', suggestion: 'Property' },
    { name: 'error_val', type: 'Double', suggestion: 'Measure' },
    { name: 'status_flag', type: 'Integer', suggestion: 'State' },
];

export const OntologyView: React.FC<OntologyViewProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'RULES' | 'IMPACT'>('DETAILS');

  // Wizard State
  const [createStep, setCreateStep] = useState<1 | 2 | 3>(1);
  const [newEntityData, setNewEntityData] = useState({
      name: '',
      description: '',
      icon: 'Cube',
      dataset: '',
      primaryKey: '',
      titleKey: ''
  });

  // Auto-select first entity on load
  useEffect(() => {
    if (MOCK_ENTITIES.length > 0 && !selectedEntity) {
      setSelectedEntity(MOCK_ENTITIES[0]);
    }
  }, []);

  const detailData = selectedEntity ? (MOCK_ENTITY_DETAILS_MAP[selectedEntity.id] || MOCK_ENTITY_DETAILS_MAP['E-Cell-280']) : null;

  // --- Sub-Render: Entity List View ---
  const renderListView = () => (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-white">业务实体 <span className="text-slate-500 text-lg">/ Business Entity</span></h2>
          <p className="text-slate-400 text-sm mt-1">定义电池全生命周期模型、电化学规则与语义关系</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">导入BOM结构</Button>
          <Button onClick={() => setViewMode('CREATE')}><Plus className="w-4 h-4" /> 新建业务实体</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full flex-1 min-h-0">
        {/* Left Tree/List */}
        <Card className="col-span-4 h-full overflow-hidden flex flex-col" title="实体逻辑树">
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索电芯代码 / 物料名称..." 
              className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1 overflow-y-auto flex-1">
            {MOCK_ENTITIES.map(entity => (
              <div 
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className={`p-3 rounded cursor-pointer border border-transparent hover:border-slate-700 hover:bg-slate-800/50 transition-all ${selectedEntity?.id === entity.id ? 'bg-cyan-950/30 border-cyan-500/30' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-slate-200">{entity.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">{entity.id}</div>
                  </div>
                  <Badge status={entity.status} />
                </div>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                   <span className="flex items-center gap-1"><GitBranch className="w-3 h-3"/> {entity.linkedProcesses} 流程</span>
                   <span className="flex items-center gap-1"><Layers className="w-3 h-3"/> {entity.linkedAgents} 智能体</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Detail/Config/Impact Panel */}
        <div className="col-span-8 h-full flex flex-col">
           {selectedEntity && detailData ? (
             <Card className="h-full flex flex-col" title={`实体详情: ${selectedEntity.name}`}>
                {/* Detail Navigation Tabs */}
                <div className="flex border-b border-slate-700 mb-4 shrink-0">
                  {['DETAILS', 'RULES', 'IMPACT'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab 
                          ? 'border-cyan-500 text-cyan-400' 
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab === 'DETAILS' && '属性与定义'}
                      {tab === 'RULES' && '语义与规则'}
                      {tab === 'IMPACT' && '影响分析'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  {activeTab === 'DETAILS' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                          <label className="text-xs text-slate-500 uppercase">数据源</label>
                          <div className="text-sm text-slate-200 flex items-center gap-2 mt-1">
                            <Database className="w-3 h-3 text-emerald-500" /> {detailData.source}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                           <label className="text-xs text-slate-500 uppercase">更新频率</label>
                           <div className="text-sm text-slate-200 mt-1">{detailData.freq}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">属性定义</h4>
                        <table className="w-full text-sm text-left text-slate-400">
                          <thead className="bg-slate-900 text-xs uppercase text-slate-500">
                            <tr>
                              <th className="p-2">属性代码</th>
                              <th className="p-2">业务名称</th>
                              <th className="p-2">单位</th>
                              <th className="p-2">阈值范围</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {detailData.attributes.map((attr: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="p-2 font-mono text-slate-300">{attr.code}</td>
                                    <td className="p-2">{attr.name}</td>
                                    <td className="p-2">{attr.unit}</td>
                                    <td className="p-2">{attr.range}</td>
                                </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-3 mt-4">
                          <Button variant="secondary" className="w-full justify-center">+ 新增属性</Button>
                          <Button variant="secondary" className="w-full justify-center">映射设备点位</Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'RULES' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="p-4 border border-cyan-500/20 bg-cyan-900/10 rounded">
                          <h4 className="text-cyan-400 text-sm font-medium mb-2 flex items-center gap-2">
                              <Activity className="w-4 h-4" /> 规则模拟器 (Rule Engine)
                          </h4>
                          <p className="text-xs text-slate-400 mb-3">配置当实体数据满足特定条件时，AI 应如何判定状态。</p>
                          <div className="bg-slate-950 p-3 rounded font-mono text-sm border border-slate-800">
                              <span className="text-purple-400">IF</span> ({detailData.attributes[0].code} &gt; Limit) <br/>
                              <span className="text-purple-400">THEN</span> set_grade(<span className="text-amber-400">ABNORMAL</span>) <br/>
                              <span className="text-purple-400">AND</span> trigger_agent(<span className="text-green-400">"Quality-Guardian"</span>)
                          </div>
                          <div className="flex gap-2 mt-3 justify-end">
                              <Button variant="secondary" className="text-xs h-8">校验语法</Button>
                              <Button variant="primary" className="text-xs h-8">模拟规则生效</Button>
                          </div>
                      </div>

                       <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">已生效规则</h4>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between p-2 bg-slate-900 rounded border-l-2 border-emerald-500">
                               <span className="text-sm">自动判定规则 V3.0</span>
                               <Badge status={StatusLevel.VERIFIED} />
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'IMPACT' && (
                       <div className="animate-in fade-in duration-300">
                          <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                              修改此实体规格将影响 <strong>{detailData.impactCount}</strong> 个下游环节
                          </div>
                          
                          <div className="relative h-64 bg-slate-950 rounded border border-slate-800 mb-4 overflow-hidden flex items-center justify-center">
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center gap-8">
                                      <div className="w-24 h-24 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-cyan-900/20 text-xs text-center p-2 relative z-10 break-words">
                                          {selectedEntity.name}
                                      </div>
                                      <ArrowRight className="text-slate-600" />
                                      <div className="flex flex-col gap-4">
                                          {detailData.impactGraph.map((item: string, idx: number) => (
                                              <div key={idx} className="p-2 border border-slate-700 bg-slate-900 rounded text-xs w-32 text-center">{item}</div>
                                          ))}
                                      </div>
                                      <ArrowRight className="text-slate-600" />
                                      <div className="p-2 border border-dashed border-red-500/50 bg-red-900/10 rounded text-xs w-32 text-center text-red-300">
                                          最终影响:<br/>{detailData.finalImpact}
                                      </div>
                                  </div>
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                                      <defs>
                                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                                          </pattern>
                                      </defs>
                                      <rect width="100%" height="100%" fill="url(#grid)" />
                                  </svg>
                              </div>
                          </div>
                       </div>
                  )}
                </div>
             </Card>
           ) : (
             <div className="h-full flex items-center justify-center text-slate-500 flex-col border border-dashed border-slate-800 rounded">
                <Database className="w-12 h-12 mb-4 opacity-20" />
                <p>请从左侧选择一个业务实体以查看详情</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  // --- Sub-Render: Create Wizard ---
  const renderCreateWizard = () => (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <Button variant="ghost" onClick={() => setViewMode('LIST')} className="w-10 h-10 p-0 justify-center rounded-full border border-slate-700">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h2 className="text-xl text-white font-medium">创建新业务实体 (本体对象)</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className={`flex items-center gap-1 ${createStep >= 1 ? 'text-cyan-400' : ''}`}>
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">1</div> 基础定义
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={`flex items-center gap-1 ${createStep >= 2 ? 'text-cyan-400' : ''}`}>
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">2</div> 数据映射
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={`flex items-center gap-1 ${createStep >= 3 ? 'text-cyan-400' : ''}`}>
                         <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] border-current">3</div> 索引与发布
                    </span>
                </div>
            </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 flex gap-8 min-h-0">
             
             {/* Left Guide Panel */}
             <div className="w-64 space-y-4">
                 <Card className="bg-slate-900/50 border-cyan-500/20">
                     <div className="flex items-center gap-3 mb-3 text-cyan-400">
                         <Activity className="w-5 h-5" />
                         <span className="font-medium text-sm">本体构建指南</span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed">
                         在 Nexus OS 中，每个实体都必须映射到底层数据湖中的一个或多个物理表 (关联数据表)。<br/><br/>
                         系统将自动监控数据源变动，并触发关联的决策流程。
                     </p>
                 </Card>
                 <div className="p-4 rounded border border-dashed border-slate-800 text-center text-slate-600">
                     <div className="text-xs">当前状态</div>
                     <div className="text-xl font-mono text-slate-400 mt-1">草稿</div>
                 </div>
             </div>

             {/* Main Form Area */}
             <div className="flex-1 bg-slate-950 rounded border border-slate-800 p-8 overflow-y-auto">
                 
                 {/* STEP 1: Definition */}
                 {createStep === 1 && (
                     <div className="max-w-2xl space-y-6 animate-in slide-in-from-right-4 duration-300">
                         <div>
                             <label className="block text-sm font-medium text-slate-300 mb-2">实体名称 (Singular Name)</label>
                             <input 
                                type="text" 
                                placeholder="例如: 涂布机故障工单" 
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none"
                                value={newEntityData.name}
                                onChange={e => setNewEntityData({...newEntityData, name: e.target.value})}
                             />
                             <p className="text-xs text-slate-500 mt-1">该名称将在决策流和图谱中显示。</p>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-300 mb-2">描述 (Description)</label>
                             <textarea 
                                rows={4}
                                placeholder="描述该实体的业务含义及其对决策的影响..." 
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none"
                                value={newEntityData.description}
                                onChange={e => setNewEntityData({...newEntityData, description: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-300 mb-2">实体图标</label>
                             <div className="flex gap-4">
                                 {['Cube', 'Database', 'Activity', 'ShieldAlert'].map((icon, i) => (
                                     <div key={i} className={`w-12 h-12 rounded border flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-all ${newEntityData.icon === icon ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                                         <Database className="w-6 h-6" />
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 )}

                 {/* STEP 2: Data Mapping */}
                 {createStep === 2 && (
                     <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                         <div>
                             <label className="block text-sm font-medium text-slate-300 mb-2">选择底层数据源 (Backing Dataset)</label>
                             <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-slate-700 rounded bg-slate-900/50 p-2">
                                 {MOCK_DATASETS.map(ds => (
                                     <div 
                                        key={ds.id} 
                                        onClick={() => setNewEntityData({...newEntityData, dataset: ds.id})}
                                        className={`flex items-center justify-between p-3 rounded cursor-pointer border ${newEntityData.dataset === ds.id ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
                                     >
                                         <div className="flex items-center gap-3">
                                             <Table className="w-4 h-4 text-slate-400" />
                                             <div>
                                                 <div className="text-sm text-slate-200">{ds.name}</div>
                                                 <div className="text-xs text-slate-500 font-mono">{ds.id}</div>
                                             </div>
                                         </div>
                                         <div className="text-right">
                                             <div className="text-xs text-slate-400">{ds.rows} 行</div>
                                             <div className="text-[10px] text-emerald-500">{ds.update}</div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         
                         {newEntityData.dataset && (
                             <div>
                                 <label className="block text-sm font-medium text-slate-300 mb-2">属性映射配置 (Property Mapping)</label>
                                 <table className="w-full text-sm text-left text-slate-400 border border-slate-800 rounded overflow-hidden">
                                     <thead className="bg-slate-900 text-xs uppercase text-slate-500">
                                         <tr>
                                             <th className="p-3">源字段 (Column)</th>
                                             <th className="p-3">数据类型</th>
                                             <th className="p-3">映射为属性</th>
                                             <th className="p-3">语义类型</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                                         {MOCK_COLUMNS.map((col, idx) => (
                                             <tr key={idx}>
                                                 <td className="p-3 font-mono text-slate-300">{col.name}</td>
                                                 <td className="p-3">
                                                     <Badge status={StatusLevel.UNCERTAIN} className="text-[10px] text-slate-400 border-slate-600 bg-slate-800">{col.type}</Badge>
                                                 </td>
                                                 <td className="p-3">
                                                     <input type="text" defaultValue={col.name} className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full" />
                                                 </td>
                                                 <td className="p-3">
                                                     <select className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full">
                                                         <option>{col.suggestion}</option>
                                                         <option>Title</option>
                                                         <option>Primary Key</option>
                                                     </select>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         )}
                     </div>
                 )}

                 {/* STEP 3: Keys & Config */}
                 {createStep === 3 && (
                     <div className="max-w-2xl space-y-8 animate-in slide-in-from-right-4 duration-300">
                         <div className="grid grid-cols-2 gap-6">
                             <div className="p-4 border border-slate-700 rounded bg-slate-900/30 hover:border-cyan-500/50 transition-colors">
                                 <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                     <Key className="w-5 h-5" />
                                     <span className="font-medium">主键 (Primary Key)</span>
                                 </div>
                                 <p className="text-xs text-slate-500 mb-3">用于在整个 OS 中唯一标识该实体实例。</p>
                                 <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                                     <option>log_id</option>
                                     <option>machine_code</option>
                                 </select>
                             </div>
                             <div className="p-4 border border-slate-700 rounded bg-slate-900/30 hover:border-cyan-500/50 transition-colors">
                                 <div className="flex items-center gap-2 mb-2 text-purple-400">
                                     <Type className="w-5 h-5" />
                                     <span className="font-medium">显示标题 (Title)</span>
                                 </div>
                                 <p className="text-xs text-slate-500 mb-3">在图谱和搜索结果中显示的首要名称。</p>
                                 <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                                     <option>machine_code</option>
                                     <option>log_id</option>
                                 </select>
                             </div>
                         </div>

                         <div className="space-y-4 pt-4 border-t border-slate-800">
                             <h3 className="text-sm font-medium text-slate-300">高级配置</h3>
                             <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                 <div className="flex items-center gap-3">
                                     <Fingerprint className="w-5 h-5 text-slate-400" />
                                     <div>
                                         <div className="text-sm text-slate-200">启用全文检索索引</div>
                                         <div className="text-xs text-slate-500">允许用户通过全局搜索栏查找该实体记录</div>
                                     </div>
                                 </div>
                                 <input type="checkbox" defaultChecked className="toggle" />
                             </div>
                             <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                 <div className="flex items-center gap-3">
                                     <FileText className="w-5 h-5 text-slate-400" />
                                     <div>
                                         <div className="text-sm text-slate-200">启用时间序列追踪</div>
                                         <div className="text-xs text-slate-500">自动记录属性变更历史 (History API)</div>
                                     </div>
                                 </div>
                                 <input type="checkbox" defaultChecked className="toggle" />
                             </div>
                         </div>
                     </div>
                 )}

             </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
            {createStep > 1 && (
                <Button variant="secondary" onClick={() => setCreateStep(prev => Math.max(1, prev - 1) as any)}>上一步</Button>
            )}
            {createStep < 3 ? (
                <Button onClick={() => setCreateStep(prev => Math.min(3, prev + 1) as any)}>下一步: {createStep === 1 ? '数据映射' : '配置索引'}</Button>
            ) : (
                <Button className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50" onClick={() => setViewMode('LIST')}>
                    <Check className="w-4 h-4 mr-2" /> 发布实体
                </Button>
            )}
        </div>
    </div>
  );

  return viewMode === 'LIST' ? renderListView() : renderCreateWizard();
};
