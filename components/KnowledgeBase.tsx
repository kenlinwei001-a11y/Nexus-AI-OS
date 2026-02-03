
import React, { useState } from 'react';
import { MOCK_CONSTRAINTS, MOCK_SKILLS } from '../constants';
import { ConstraintRule, AnalysisSkill, StatusLevel } from '../types';
import { Button, Card, Badge, getStatusColor } from './UI';
import { Search, Plus, ShieldCheck, Ruler, Microscope, BrainCircuit, Activity, Lock, Eye, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'CONSTRAINTS' | 'SKILLS'>('CONSTRAINTS');
    const [selectedConstraint, setSelectedConstraint] = useState<ConstraintRule | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<AnalysisSkill | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Filter Logic
    const filteredConstraints = MOCK_CONSTRAINTS.filter(c => c.name.includes(searchTerm) || c.id.includes(searchTerm));
    const filteredSkills = MOCK_SKILLS.filter(s => s.name.includes(searchTerm) || s.id.includes(searchTerm));

    // Render Helpers
    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'ENV': return <Activity className="w-4 h-4 text-emerald-400"/>;
            case 'EQUIP': return <Ruler className="w-4 h-4 text-blue-400"/>;
            case 'SAFETY': return <ShieldCheck className="w-4 h-4 text-red-400"/>;
            default: return <Lock className="w-4 h-4 text-slate-400"/>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'PREDICTION': return <Activity className="w-4 h-4 text-purple-400"/>;
            case 'VISION': return <Eye className="w-4 h-4 text-cyan-400"/>;
            case 'OPTIMIZATION': return <BrainCircuit className="w-4 h-4 text-emerald-400"/>;
            default: return <Microscope className="w-4 h-4 text-amber-400"/>;
        }
    };

    const renderConstraintList = () => (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            {/* Create New Card */}
            <div 
                onClick={() => setIsCreating(true)}
                className="h-32 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-slate-900/50 transition-all cursor-pointer"
            >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">新增约束规则</span>
            </div>

            {filteredConstraints.map(rule => (
                <div 
                    key={rule.id}
                    onClick={() => { setSelectedConstraint(rule); setSelectedSkill(null); setIsCreating(false); }}
                    className={`p-4 rounded border cursor-pointer transition-all hover:bg-slate-800/80 ${selectedConstraint?.id === rule.id ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900/50 border-slate-800'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                                {getCategoryIcon(rule.category)}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-200">{rule.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{rule.id}</div>
                            </div>
                        </div>
                        <Badge status={rule.status} />
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2 mb-3 h-8">
                        {rule.description}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/50">
                         <span className="text-slate-500">阈值: <span className="text-slate-300 font-mono">{rule.threshold}</span></span>
                         <span className="text-slate-500">{rule.activeProcesses} 个流程引用</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkillList = () => (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            {/* Create New Card */}
            <div 
                onClick={() => setIsCreating(true)}
                className="h-32 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-slate-900/50 transition-all cursor-pointer"
            >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">新增分析技能</span>
            </div>

            {filteredSkills.map(skill => (
                <div 
                    key={skill.id}
                    onClick={() => { setSelectedSkill(skill); setSelectedConstraint(null); setIsCreating(false); }}
                    className={`p-4 rounded border cursor-pointer transition-all hover:bg-slate-800/80 ${selectedSkill?.id === skill.id ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900/50 border-slate-800'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                                {getTypeIcon(skill.type)}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-200">{skill.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{skill.id}</div>
                            </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${skill.complexity === 'HIGH' ? 'border-purple-500/30 text-purple-400' : 'border-slate-600 text-slate-400'}`}>
                            {skill.complexity === 'HIGH' ? '高' : skill.complexity === 'MED' ? '中' : '低'}
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2 mb-3 h-8">
                        {skill.description}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/50">
                         <span className="text-slate-500">算法: <span className="text-cyan-400">{skill.algorithm}</span></span>
                         <span className="text-slate-500">调用 {skill.usageCount} 次</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDetail = () => {
        if (isCreating) {
            return (
                <Card title={`新建${activeTab === 'CONSTRAINTS' ? '约束规则' : '分析技能'}`} className="h-full flex flex-col border-dashed border-slate-700">
                    <div className="flex-1 flex items-center justify-center flex-col text-slate-500">
                        <FileCode className="w-16 h-16 mb-4 opacity-20" />
                        <p>表单配置区域 (未实装)</p>
                        <div className="flex gap-4 mt-8">
                             <Button variant="secondary" onClick={() => setIsCreating(false)}>取消</Button>
                             <Button onClick={() => setIsCreating(false)}>确认创建</Button>
                        </div>
                    </div>
                </Card>
            );
        }

        if (activeTab === 'CONSTRAINTS' && selectedConstraint) {
            return (
                <Card title={`规则详情: ${selectedConstraint.id}`} className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                    <div className="flex-1 overflow-y-auto space-y-6">
                        <div>
                            <label className="text-xs text-slate-500 uppercase">规则名称</label>
                            <div className="text-lg font-medium text-white mt-1">{selectedConstraint.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase">分类 (Category)</label>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-300">
                                    {getCategoryIcon(selectedConstraint.category)} {selectedConstraint.category}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase">管控阈值 (Threshold)</label>
                                <div className="mt-1 font-mono text-sm text-amber-400 border border-amber-500/20 bg-amber-900/10 px-2 py-1 rounded w-fit">
                                    {selectedConstraint.threshold}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">逻辑定义 (Logic Definition)</label>
                            <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-sm text-emerald-400 leading-relaxed">
                                {selectedConstraint.logicSnippet}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">关联流程</label>
                            <div className="mt-2 space-y-2">
                                {[1,2,3].slice(0, Math.min(3, selectedConstraint.activeProcesses)).map(i => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
                                        <span>Process-Link-#{i*102} (涂布工艺)</span>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    </div>
                                ))}
                                {selectedConstraint.activeProcesses > 3 && (
                                    <div className="text-xs text-slate-500 pl-2">... 以及其他 {selectedConstraint.activeProcesses - 3} 个流程</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-2">
                         <Button variant="danger">停用规则</Button>
                         <Button>编辑规则</Button>
                    </div>
                </Card>
            );
        }

        if (activeTab === 'SKILLS' && selectedSkill) {
             return (
                <Card title={`技能详情: ${selectedSkill.id}`} className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                    <div className="flex-1 overflow-y-auto space-y-6">
                        <div>
                            <label className="text-xs text-slate-500 uppercase">技能名称</label>
                            <div className="text-lg font-medium text-white mt-1">{selectedSkill.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase">算法模型</label>
                                <div className="mt-1 text-sm text-cyan-400 font-mono">
                                    {selectedSkill.algorithm}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase">计算复杂度</label>
                                <Badge status={selectedSkill.complexity === 'HIGH' ? StatusLevel.RISK : StatusLevel.VERIFIED} className="mt-1">
                                     {selectedSkill.complexity === 'HIGH' ? '高' : selectedSkill.complexity === 'MED' ? '中' : '低'}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase">代码片段 (Python)</label>
                            <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                                <pre>{selectedSkill.codeSnippet}</pre>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-900 rounded border border-slate-800 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-slate-400">
                                该技能已被 <strong>{selectedSkill.usageCount}</strong> 个智能体实例调用。修改可能会影响产线节拍。
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-2">
                         <Button variant="secondary">测试运行</Button>
                         <Button>发布新版本</Button>
                    </div>
                </Card>
            );
        }

        return (
            <div className="h-full flex items-center justify-center text-slate-500 flex-col border border-dashed border-slate-800 rounded bg-slate-900/20">
                <FileCode className="w-12 h-12 mb-4 opacity-20" />
                <p>请从左侧列表选择项目以查看详情</p>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-light text-white">知识与算法库 <span className="text-slate-500 text-lg">/ Knowledge Base</span></h2>
                    <p className="text-slate-400 text-sm mt-1">
                        管理锂电制造领域的 {MOCK_CONSTRAINTS.length} 条约束规则与 {MOCK_SKILLS.length} 个核心分析技能
                    </p>
                </div>
                <div className="flex bg-slate-900 border border-slate-800 rounded p-1">
                    <button 
                        onClick={() => { setActiveTab('CONSTRAINTS'); setIsCreating(false); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${activeTab === 'CONSTRAINTS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        约束规则库 ({MOCK_CONSTRAINTS.length})
                    </button>
                    <button 
                        onClick={() => { setActiveTab('SKILLS'); setIsCreating(false); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${activeTab === 'SKILLS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        分析技能库 ({MOCK_SKILLS.length})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-full flex-1 min-h-0">
                {/* Left List Panel */}
                <div className="col-span-7 flex flex-col gap-4">
                     <div className="relative shrink-0">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`搜索${activeTab === 'CONSTRAINTS' ? '规则名称或阈值' : '技能名称或算法'}...`}
                            className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200 placeholder-slate-600"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1">
                        {activeTab === 'CONSTRAINTS' ? renderConstraintList() : renderSkillList()}
                    </div>
                </div>

                {/* Right Detail Panel */}
                <div className="col-span-5 h-full">
                    {renderDetail()}
                </div>
            </div>
        </div>
    );
};
