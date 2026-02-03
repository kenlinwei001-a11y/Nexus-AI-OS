
// Enum for Status Colors/Semantics
export enum StatusLevel {
  PROCESSING = 'PROCESSING', // Blue
  VERIFIED = 'VERIFIED',     // Green
  UNCERTAIN = 'UNCERTAIN',   // Orange
  RISK = 'RISK'              // Red
}

// Level 3: Object List Item
export interface Entity {
  id: string;
  name: string;
  type: 'ENTITY' | 'EVENT' | 'METRIC' | 'CONSTRAINT';
  linkedProcesses: number;
  linkedAgents: number;
  status: StatusLevel;
  lastUpdated: string;
}

// Level 4: Entity Detail
export interface EntityDetail extends Entity {
  description: string;
  attributes: Record<string, string | number>;
  relationships: { targetId: string; relation: string }[];
  dataSources: string[];
}

// Process Node for Visual Editor
export interface ProcessNode {
  id: string;
  type: 'DATA' | 'CONDITION' | 'AGENT' | 'SIMULATION' | 'DECISION';
  label: string;
  status: StatusLevel;
  x: number;
  y: number;
}

export interface ProcessLink {
  from: string;
  to: string;
}

// Agent Definition
export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  style: 'CONSERVATIVE' | 'AGGRESSIVE';
  riskTolerance: number; // 0-100
  recentActivity: string;
}

// Simulation Scenario
export interface Scenario {
  id: string;
  name: string;
  parameters: Record<string, number>;
  predictedOutcome: number; // e.g., Profit or Efficiency %
  riskScore: number;
}

// Knowledge Base Types
export interface ConstraintRule {
  id: string;
  name: string;
  category: 'ENV' | 'EQUIP' | 'MAT' | 'PROCESS' | 'SAFETY';
  description: string;
  logicSnippet: string;
  threshold: string;
  activeProcesses: number;
  status: StatusLevel;
}

export interface AnalysisSkill {
  id: string;
  name: string;
  type: 'PREDICTION' | 'DIAGNOSIS' | 'OPTIMIZATION' | 'VISION';
  description: string;
  algorithm: string; // e.g., XGBoost, CNN
  codeSnippet: string;
  complexity: 'LOW' | 'MED' | 'HIGH';
  usageCount: number;
}

// Navigation State
export type PageView = 
  | 'DASHBOARD'
  | 'ONTOLOGY_LIST' | 'ONTOLOGY_DETAIL' | 'ONTOLOGY_IMPACT'
  | 'PROCESS_LIST' | 'PROCESS_DESIGNER'
  | 'AGENT_LIST' | 'AGENT_DETAIL'
  | 'SIMULATION_LIST' | 'SIMULATION_RUN' | 'SIMULATION_ANALYSIS'
  | 'KNOWLEDGE_BASE';
