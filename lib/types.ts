export interface CyberEvent {
  id: string
  type: 'login_anomaly' | 'high_risk_ip' | 'device_mismatch' | 'brute_force' | 'session_hijack'
  severity: 'low' | 'medium' | 'high' | 'critical'
  accountId: string
  description: string
  timestamp: number
  ip?: string
  device?: string
}

export interface TransactionEvent {
  id: string
  type: 'large_transfer' | 'new_beneficiary' | 'cross_border' | 'rapid_succession' | 'round_amount'
  amount: number
  currency: string
  from: string
  to: string
  accountId: string
  description: string
  timestamp: number
  country?: string
}

export interface UnifiedEvent {
  id: string
  accountId: string
  cyberSignals: CyberEvent[]
  transactionData: TransactionEvent[]
  riskScore: number
  timestamp: number
}

export interface RiskScore {
  accountId: string
  cyberRisk: number
  transactionRisk: number
  networkRisk: number
  unifiedScore: number
  classification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: number
}

export interface NetworkNode {
  id: string
  label: string
  risk: number
  type: 'primary' | 'connected' | 'mule'
}

export interface NetworkLink {
  source: string
  target: string
  amount: number
  suspicious: boolean
}

export interface NetworkGraph {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export interface GeminiAnalysis {
  fraudClassification: string
  technicalReasoning: string
  regulatoryExplanation: string
  recommendedAction: string
  confidence: number
  timestamp: number
}

export interface GeminiUserExplanation {
  summary: string
  whatHappened: string
  actionsTaken: string
  safetyAdvice: string
  timestamp: number
}

export interface Alert {
  id: string
  type: 'containment' | 'risk_escalation' | 'network_detection' | 'cyber_threat'
  severity: 'info' | 'warning' | 'critical'
  message: string
  accountId: string
  timestamp: number
  resolved: boolean
}

export interface ContainmentStatus {
  active: boolean
  transactionsHeld: number
  accountsFrozen: string[]
  timestamp: number
}

export interface FinancialExposure {
  fundsAtRisk: number
  estimatedLossPrevented: number
  recoveryProbability: number
  containmentResponseTime: number
}

export interface SimulationState {
  accounts: string[]
  events: UnifiedEvent[]
  riskScores: RiskScore[]
  network: NetworkGraph
  alerts: Alert[]
  containment: ContainmentStatus
  financialExposure: FinancialExposure
  geminiAnalysis: GeminiAnalysis | null
  geminiUserExplanation: GeminiUserExplanation | null
  cyberEvents: CyberEvent[]
  transactionEvents: TransactionEvent[]
}

export type AppMode = 'landing' | 'bank' | 'user'
