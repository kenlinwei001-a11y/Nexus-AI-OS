
import { Entity, StatusLevel, Agent, Scenario, ProcessNode, ProcessLink, ConstraintRule, AnalysisSkill } from './types';

// Mock Entities (Lithium Battery Manufacturing Context)
export const MOCK_ENTITIES: Entity[] = [
  { id: 'E-Cell-280', name: 'LFP-280Ah-储能电芯', type: 'ENTITY', linkedProcesses: 15, linkedAgents: 4, status: StatusLevel.VERIFIED, lastUpdated: '10:42:01' },
  { id: 'E-Mat-Li2CO3', name: '原材料-电池级碳酸锂', type: 'ENTITY', linkedProcesses: 8, linkedAgents: 2, status: StatusLevel.RISK, lastUpdated: '09:15:00' },
  { id: 'M-Coat-CPK', name: '涂布面密度一致性(CPK)', type: 'METRIC', linkedProcesses: 24, linkedAgents: 5, status: StatusLevel.PROCESSING, lastUpdated: '实时' },
  { id: 'Ev-Safe-01', name: '热失控风险早期预警', type: 'EVENT', linkedProcesses: 4, linkedAgents: 1, status: StatusLevel.UNCERTAIN, lastUpdated: '11:05:22' },
  { id: 'C-Env-Dew', name: '注液车间露点约束', type: 'CONSTRAINT', linkedProcesses: 6, linkedAgents: 1, status: StatusLevel.VERIFIED, lastUpdated: '昨天' },
];

// Detailed Data Map for Dynamic Rendering
export const MOCK_ENTITY_DETAILS_MAP: Record<string, any> = {
  'E-Cell-280': {
    source: 'MES / SCADA (产线)',
    freq: '实时 (ms级)',
    attributes: [
      { code: 'ocv_voltage', name: '开路电压', unit: 'mV', range: '3.2 - 3.45' },
      { code: 'ac_impedance', name: '交流内阻 (ACIR)', unit: 'mΩ', range: '< 0.25' },
      { code: 'self_discharge_k', name: '自放电K值', unit: 'mV/h', range: '< 0.05' },
      { code: 'capacity_nominal', name: '额定容量', unit: 'Ah', range: '280 ± 2.0' }
    ],
    impactCount: 3,
    impactGraph: ['模组堆叠工艺', 'Pack热管理设计'],
    finalImpact: '储能柜整体能效'
  },
  'E-Mat-Li2CO3': {
    source: 'SRM / LIMS (实验室)',
    freq: '批次级 (T+1)',
    attributes: [
      { code: 'purity_li2co3', name: '主含量', unit: '%', range: '≥ 99.5' },
      { code: 'impurity_na', name: '钠杂质含量', unit: 'ppm', range: '< 150' },
      { code: 'impurity_fe', name: '铁杂质含量', unit: 'ppm', range: '< 10' },
      { code: 'particle_d50', name: '粒径D50', unit: 'μm', range: '4.0 - 6.0' }
    ],
    impactCount: 12,
    impactGraph: ['正极材料烧结', '浆料粘度控制'],
    finalImpact: '电芯循环寿命'
  },
  'M-Coat-CPK': {
    source: 'QMS (质量系统)',
    freq: '实时 (秒级)',
    attributes: [
      { code: 'surface_density_avg', name: '面密度均值', unit: 'mg/cm²', range: 'Target ± 1.5%' },
      { code: 'cpk_value', name: '过程能力指数', unit: '-', range: '> 1.33' },
      { code: 'coating_speed', name: '涂布速度', unit: 'm/min', range: '50 - 80' },
      { code: 'oven_temp_z1', name: '烘箱一区温度', unit: '℃', range: '90 - 110' }
    ],
    impactCount: 5,
    impactGraph: ['辊压压实密度', '极耳焊接强度'],
    finalImpact: '电池安全性能'
  },
  'Ev-Safe-01': {
    source: 'BMS / IoT',
    freq: '事件触发',
    attributes: [
      { code: 'temp_gradient', name: '温升速率', unit: '℃/s', range: '< 1.0' },
      { code: 'voltage_drop', name: '电压突降', unit: 'mV', range: '< 50' },
      { code: 'gas_sensor', name: '气体浓度(CO)', unit: 'ppm', range: '< 20' }
    ],
    impactCount: 1,
    impactGraph: ['消防系统联动', '产线急停'],
    finalImpact: '工厂安全生产'
  },
  'C-Env-Dew': {
    source: 'FMCS (厂务)',
    freq: '5分钟',
    attributes: [
      { code: 'dew_point', name: '露点温度', unit: '℃', range: '< -45' },
      { code: 'temp_ambient', name: '环境温度', unit: '℃', range: '20 - 25' }
    ],
    impactCount: 2,
    impactGraph: ['注液电解液分解', '封口密封性'],
    finalImpact: '电芯自放电率'
  }
};

export const MOCK_AGENTS: Agent[] = [
  { id: 'A-001', name: '计划执行智能体', role: '生产执行', capabilities: ['生产进度实时监控', '异常调度响应', '工单自动拆解'], style: 'AGGRESSIVE', riskTolerance: 40, recentActivity: '调整 #2 产线排程以应对急单' },
  { id: 'A-002', name: '库存计划智能体', role: '库存管理', capabilities: ['动态安全库存计算', '呆滞料预警分析', '周转率优化'], style: 'CONSERVATIVE', riskTolerance: 10, recentActivity: '建议下调正极材料安全库存水平' },
  { id: 'A-003', name: '物料计划智能体', role: '物料控制', capabilities: ['缺料风险预警', 'JIT 配送路径计算', '齐套性分析'], style: 'AGGRESSIVE', riskTolerance: 30, recentActivity: '触发隔膜紧急补货流程' },
  { id: 'A-004', name: '寻源智能体', role: '供应链采购', capabilities: ['供应商画像', '多维度比价模型', '合同条款合规审查'], style: 'CONSERVATIVE', riskTolerance: 15, recentActivity: '完成 2024 Q3 电解液供应商初筛' },
  { id: 'A-005', name: '供应链风险管理智能体', role: '风险控制', capabilities: ['供应中断模拟', '多级网络穿透', '地缘政治风险评估'], style: 'CONSERVATIVE', riskTolerance: 5, recentActivity: '监测到上游锂矿产地罢工风险' },
  { id: 'A-006', name: '需求预测智能体', role: '计划管理', capabilities: ['多模型销量预测', '市场波动性分析', '促销效果模拟'], style: 'AGGRESSIVE', riskTolerance: 50, recentActivity: '更新 Q4 储能电芯需求预测 (+15%)' },
  { id: 'A-007', name: '订单巡检智能体', role: '交付管理', capabilities: ['订单全链路追踪', '交付延期风险识别', '客户满意度预判'], style: 'CONSERVATIVE', riskTolerance: 10, recentActivity: '识别 3 个高优订单存在延期风险' },
  { id: 'A-008', name: '生产设备故障排查智能体', role: '设备维护', capabilities: ['故障根因分析 (RCA)', '维修知识图谱检索', '备件匹配'], style: 'AGGRESSIVE', riskTolerance: 60, recentActivity: '诊断涂布机张力异常根因' },
  { id: 'A-009', name: '生产设备预测维护智能体', role: '设备管理', capabilities: ['关键部件剩余寿命预测', '最佳维护窗口规划', '能耗异常分析'], style: 'CONSERVATIVE', riskTolerance: 20, recentActivity: '建议提前更换卷绕机轴承' },
];

export const MOCK_SCENARIOS: Scenario[] = [
  { id: 'S-A', name: '基准策略：维持当前化成工艺', parameters: { capacity: 100, risk: 20 }, predictedOutcome: 85, riskScore: 30 },
  { id: 'S-B', name: '提效策略：缩短高温静置时间', parameters: { capacity: 115, risk: 55 }, predictedOutcome: 94, riskScore: 70 },
  { id: 'S-C', name: '保守策略：增加二次筛选', parameters: { capacity: 90, risk: 5 }, predictedOutcome: 98, riskScore: 10 },
];

export const MOCK_PROCESS_NODES: ProcessNode[] = [
  { id: '1', type: 'DATA', label: '读取化成OCV数据', status: StatusLevel.VERIFIED, x: 50, y: 100 },
  { id: '2', type: 'CONDITION', label: '压降 > 阈值?', status: StatusLevel.PROCESSING, x: 250, y: 100 },
  { id: '3', type: 'AGENT', label: '质量智能体判定', status: StatusLevel.PROCESSING, x: 450, y: 100 },
  { id: '4', type: 'SIMULATION', label: '电芯寿命预测', status: StatusLevel.UNCERTAIN, x: 650, y: 100 },
  { id: '5', type: 'DECISION', label: '自动分档/降级', status: StatusLevel.UNCERTAIN, x: 850, y: 100 },
];

export const MOCK_PROCESS_LINKS: ProcessLink[] = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
  { from: '4', to: '5' },
];

// --- GENERATED MOCK DATA FOR KNOWLEDGE BASE ---

const CATEGORIES = ['ENV', 'EQUIP', 'MAT', 'PROCESS', 'SAFETY'];
const DESCRIPTIONS = [
    '防止电解液吸水分解产生HF酸', '保证电极片涂覆一致性', '避免金属异物刺穿隔膜', '确保SEI膜形成质量', '防止热失控蔓延',
    '控制搅拌过程中的气泡残留', '确保焊接强度满足振动测试', '防止卷绕错位导致的短路', '监控除湿机能耗异常', '原材料批次追溯合规'
];

// 30 Constraint Rules
export const MOCK_CONSTRAINTS: ConstraintRule[] = Array.from({ length: 30 }).map((_, i) => {
    const id = `CR-${1000 + i}`;
    let category = CATEGORIES[i % 5] as any;
    let name = `Rule-${i}: `;
    let logic = '';
    let threshold = '';

    if (i === 0) { name = '注液车间露点管控'; logic = 'IF dew_point > -45 THEN ALARM(LEVEL_HIGH)'; threshold = '< -45℃'; category = 'ENV'; }
    else if (i === 1) { name = '涂布烘箱温差一致性'; logic = 'ABS(temp_left - temp_right) < 3.0'; threshold = 'Diff < 3℃'; category = 'EQUIP'; }
    else if (i === 2) { name = '电解液水分含量'; logic = 'water_content_ppm < 20'; threshold = '< 20 ppm'; category = 'MAT'; }
    else if (i === 3) { name = '化成压力保护'; logic = 'pressure_kpa BETWEEN 200 AND 500'; threshold = '200-500 kPa'; category = 'PROCESS'; }
    else if (i === 4) { name = '静置时间下限'; logic = 'aging_time_hours >= 24.0'; threshold = '≥ 24h'; category = 'PROCESS'; }
    else if (i === 5) { name = '搅拌浆料粘度上限'; logic = 'viscosity_cp < 6000'; threshold = '< 6000 cP'; category = 'MAT'; }
    else if (i === 6) { name = '辊压厚度反弹率'; logic = 'rebound_rate < 0.05'; threshold = '< 5%'; category = 'PROCESS'; }
    else if (i === 7) { name = '环境粉尘粒子数'; logic = 'particle_count_05um < 10000'; threshold = 'ISO Class 7'; category = 'ENV'; }
    else if (i === 8) { name = '极耳焊接拉力'; logic = 'tensile_strength_n > 15.0'; threshold = '> 15N'; category = 'PROCESS'; }
    else if (i === 9) { name = '隔膜含水量'; logic = 'separator_water < 500'; threshold = '< 500 ppm'; category = 'MAT'; }
    else {
        // Procedural generation for the rest
        name = `约束规则 ${id} - ${category}参数管控`;
        logic = `sensor_${i} < limit_value`;
        threshold = `Constraint ${i}`;
    }

    return {
        id,
        name,
        category,
        description: DESCRIPTIONS[i % DESCRIPTIONS.length],
        logicSnippet: logic,
        threshold,
        activeProcesses: Math.floor(Math.random() * 10) + 1,
        status: Math.random() > 0.8 ? StatusLevel.RISK : StatusLevel.VERIFIED
    };
});

// 20 Analysis Skills
export const MOCK_SKILLS: AnalysisSkill[] = Array.from({ length: 20 }).map((_, i) => {
    const id = `SK-${2000 + i}`;
    let type = ['PREDICTION', 'DIAGNOSIS', 'OPTIMIZATION', 'VISION'][i % 4] as any;
    let name = '';
    let algo = '';

    if (i === 0) { name = '电池容量衰减预测 (RUL)'; type = 'PREDICTION'; algo = 'LSTM + Attention'; }
    else if (i === 1) { name = '涂布缺陷视觉检测'; type = 'VISION'; algo = 'YOLOv8-Seg'; }
    else if (i === 2) { name = '分容柜能耗优化策略'; type = 'OPTIMIZATION'; algo = 'Reinforcement Learning (PPO)'; }
    else if (i === 3) { name = '焊接虚焊根因诊断'; type = 'DIAGNOSIS'; algo = 'Random Forest / SHAP'; }
    else if (i === 4) { name = '电解液注液量拟合'; type = 'PREDICTION'; algo = 'Linear Regression'; }
    else if (i === 5) { name = '微短路自放电筛选'; type = 'DIAGNOSIS'; algo = 'K-Means Clustering'; }
    else if (i === 6) { name = '最佳运筹学求解'; type = 'OPTIMIZATION'; algo = 'Genetic Algorithm (GA)'; }
    else if (i === 7) { name = '极片表面异物识别'; type = 'VISION'; algo = 'ResNet-50'; }
    else {
        name = `通用分析技能 ${id}`;
        algo = 'Custom Algorithm';
    }

    return {
        id,
        name,
        type,
        description: `基于历史数据对${name}进行深度分析与处理。`,
        algorithm: algo,
        codeSnippet: `def run_analysis(data):\n    model = load_model('${algo}')\n    result = model.predict(data)\n    return result`,
        complexity: ['LOW', 'MED', 'HIGH'][i % 3] as any,
        usageCount: Math.floor(Math.random() * 500)
    };
});
