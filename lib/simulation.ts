import type {
  CyberEvent,
  TransactionEvent,
  RiskScore,
  NetworkNode,
  NetworkLink,
  Alert,
  ContainmentStatus,
  FinancialExposure,
  SimulationState,
  UnifiedEvent,
} from './types'

const ACCOUNTS = ['ACC-1001', 'ACC-1002', 'ACC-1003', 'ACC-1004', 'ACC-1005', 'ACC-1006', 'ACC-1007', 'ACC-1008']

const COUNTRIES = ['Cayman Islands', 'Switzerland', 'Panama', 'Singapore', 'Isle of Man', 'Liechtenstein']
const IPS = ['185.234.72.11', '91.132.45.88', '203.0.113.42', '198.51.100.23', '45.33.32.156']
const DEVICES = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Desktop Chrome', 'Unknown Linux Device', 'Tor Browser']

let counter = 0
function uid() {
  return `evt-${Date.now()}-${counter++}`
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateCyberEvent(accountId: string): CyberEvent {
  const types: CyberEvent['type'][] = ['login_anomaly', 'high_risk_ip', 'device_mismatch', 'brute_force', 'session_hijack']
  const type = pick(types)

  const descriptions: Record<CyberEvent['type'], string> = {
    login_anomaly: `Unusual login pattern detected from ${pick(COUNTRIES)}`,
    high_risk_ip: `Connection from flagged IP ${pick(IPS)}`,
    device_mismatch: `Unrecognized device: ${pick(DEVICES)}`,
    brute_force: `Multiple failed authentication attempts (${rand(5, 25)} tries)`,
    session_hijack: `Session token reuse detected from different geolocation`,
  }

  const severityMap: Record<CyberEvent['type'], CyberEvent['severity']> = {
    login_anomaly: 'medium',
    high_risk_ip: 'high',
    device_mismatch: 'medium',
    brute_force: 'high',
    session_hijack: 'critical',
  }

  return {
    id: uid(),
    type,
    severity: severityMap[type],
    accountId,
    description: descriptions[type],
    timestamp: Date.now(),
    ip: pick(IPS),
    device: pick(DEVICES),
  }
}

function generateTransactionEvent(accountId: string): TransactionEvent {
  const types: TransactionEvent['type'][] = ['large_transfer', 'new_beneficiary', 'cross_border', 'rapid_succession', 'round_amount']
  const type = pick(types)

  const amounts: Record<TransactionEvent['type'], number> = {
    large_transfer: rand(50000, 500000),
    new_beneficiary: rand(10000, 100000),
    cross_border: rand(25000, 250000),
    rapid_succession: rand(5000, 50000),
    round_amount: rand(1, 10) * 10000,
  }

  const descriptions: Record<TransactionEvent['type'], string> = {
    large_transfer: `Large outbound transfer of $${amounts[type].toLocaleString()}`,
    new_beneficiary: `Transfer to newly added beneficiary in ${pick(COUNTRIES)}`,
    cross_border: `Cross-border wire to ${pick(COUNTRIES)}`,
    rapid_succession: `Rapid succession: 4 transfers within 12 minutes`,
    round_amount: `Structured round-amount transfer of $${amounts[type].toLocaleString()}`,
  }

  return {
    id: uid(),
    type,
    amount: amounts[type],
    currency: 'USD',
    from: accountId,
    to: `EXT-${rand(1000, 9999)}`,
    accountId,
    description: descriptions[type],
    timestamp: Date.now(),
    country: pick(COUNTRIES),
  }
}

function calculateRiskScore(cyberEvents: CyberEvent[], txEvents: TransactionEvent[], networkLinks: NetworkLink[]): number {
  let cyberRisk = 0
  for (const e of cyberEvents) {
    if (e.severity === 'critical') cyberRisk += 30
    else if (e.severity === 'high') cyberRisk += 20
    else if (e.severity === 'medium') cyberRisk += 10
    else cyberRisk += 5
  }

  let txRisk = 0
  for (const t of txEvents) {
    if (t.type === 'cross_border') txRisk += 20
    else if (t.type === 'large_transfer') txRisk += 15
    else if (t.type === 'rapid_succession') txRisk += 25
    else txRisk += 10
  }

  const networkRisk = networkLinks.filter(l => l.suspicious).length * 15

  const raw = cyberRisk * 0.35 + txRisk * 0.4 + networkRisk * 0.25
  return Math.min(100, Math.max(0, Math.round(raw)))
}

function classifyRisk(score: number): RiskScore['classification'] {
  if (score >= 75) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 25) return 'MEDIUM'
  return 'LOW'
}

// Global simulation state
let state: SimulationState = createInitialState()

function createInitialState(): SimulationState {
  const nodes: NetworkNode[] = ACCOUNTS.map(acc => ({
    id: acc,
    label: acc,
    risk: rand(5, 30),
    type: 'primary' as const,
  }))

  const links: NetworkLink[] = [
    { source: 'ACC-1001', target: 'ACC-1003', amount: 45000, suspicious: false },
    { source: 'ACC-1002', target: 'ACC-1005', amount: 120000, suspicious: true },
    { source: 'ACC-1003', target: 'ACC-1006', amount: 78000, suspicious: false },
    { source: 'ACC-1004', target: 'ACC-1007', amount: 250000, suspicious: true },
    { source: 'ACC-1005', target: 'ACC-1008', amount: 33000, suspicious: false },
    { source: 'ACC-1001', target: 'ACC-1004', amount: 95000, suspicious: true },
    { source: 'ACC-1006', target: 'ACC-1002', amount: 67000, suspicious: false },
  ]

  return {
    accounts: ACCOUNTS,
    events: [],
    riskScores: ACCOUNTS.map(acc => ({
      accountId: acc,
      cyberRisk: rand(5, 25),
      transactionRisk: rand(5, 20),
      networkRisk: rand(0, 15),
      unifiedScore: rand(10, 35),
      classification: 'LOW',
      timestamp: Date.now(),
    })),
    network: { nodes, links },
    alerts: [],
    containment: {
      active: false,
      transactionsHeld: 0,
      accountsFrozen: [],
      timestamp: Date.now(),
    },
    financialExposure: {
      fundsAtRisk: 0,
      estimatedLossPrevented: 0,
      recoveryProbability: 0.85,
      containmentResponseTime: 0,
    },
    geminiAnalysis: null,
    geminiUserExplanation: null,
    cyberEvents: [],
    transactionEvents: [],
  }
}

export function simulateTick(): SimulationState {
  const targetAccount = pick(ACCOUNTS)

  // Generate new events
  const newCyber = generateCyberEvent(targetAccount)
  const newTx = generateTransactionEvent(targetAccount)

  state.cyberEvents = [newCyber, ...state.cyberEvents].slice(0, 50)
  state.transactionEvents = [newTx, ...state.transactionEvents].slice(0, 50)

  // Create unified event
  const accountCyber = state.cyberEvents.filter(e => e.accountId === targetAccount).slice(0, 5)
  const accountTx = state.transactionEvents.filter(e => e.accountId === targetAccount).slice(0, 5)

  const unifiedEvent: UnifiedEvent = {
    id: uid(),
    accountId: targetAccount,
    cyberSignals: accountCyber,
    transactionData: accountTx,
    riskScore: 0,
    timestamp: Date.now(),
  }

  // Calculate risk for target account
  const accountLinks = state.network.links.filter(l => l.source === targetAccount || l.target === targetAccount)
  const score = calculateRiskScore(accountCyber, accountTx, accountLinks)
  unifiedEvent.riskScore = score

  // Update risk scores
  const existingIdx = state.riskScores.findIndex(r => r.accountId === targetAccount)
  const cyberRisk = Math.min(100, accountCyber.length * 15)
  const txRisk = Math.min(100, accountTx.reduce((sum, t) => sum + (t.amount > 100000 ? 25 : 10), 0))
  const networkRisk = Math.min(100, accountLinks.filter(l => l.suspicious).length * 20)

  const newRiskScore: RiskScore = {
    accountId: targetAccount,
    cyberRisk,
    transactionRisk: txRisk,
    networkRisk,
    unifiedScore: score,
    classification: classifyRisk(score),
    timestamp: Date.now(),
  }

  if (existingIdx >= 0) {
    state.riskScores[existingIdx] = newRiskScore
  } else {
    state.riskScores.push(newRiskScore)
  }

  // Update network node risk
  const nodeIdx = state.network.nodes.findIndex(n => n.id === targetAccount)
  if (nodeIdx >= 0) {
    state.network.nodes[nodeIdx].risk = score
    if (score > 70) {
      state.network.nodes[nodeIdx].type = 'mule'
    }
  }

  // Propagate risk to connected nodes
  if (score > 60) {
    for (const link of accountLinks) {
      const connectedId = link.source === targetAccount ? link.target : link.source
      const connIdx = state.network.nodes.findIndex(n => n.id === connectedId)
      if (connIdx >= 0) {
        const propagated = Math.min(100, state.network.nodes[connIdx].risk + Math.round(score * 0.15))
        state.network.nodes[connIdx].risk = propagated
      }
      link.suspicious = score > 65
    }
  }

  // Maybe add a new suspicious link
  if (Math.random() > 0.7) {
    const from = pick(ACCOUNTS)
    const to = pick(ACCOUNTS.filter(a => a !== from))
    const exists = state.network.links.some(l => (l.source === from && l.target === to))
    if (!exists) {
      state.network.links.push({
        source: from,
        target: to,
        amount: rand(10000, 300000),
        suspicious: score > 50,
      })
    }
  }

  // Generate alerts
  if (score > 60) {
    state.alerts = [{
      id: uid(),
      type: score > 75 ? 'containment' : 'risk_escalation',
      severity: score > 75 ? 'critical' : 'warning',
      message: score > 75
        ? `CONTAINMENT ACTIVATED: Account ${targetAccount} risk score ${score}/100`
        : `Risk escalation: Account ${targetAccount} elevated to ${classifyRisk(score)}`,
      accountId: targetAccount,
      timestamp: Date.now(),
      resolved: false,
    }, ...state.alerts].slice(0, 30)
  }

  // Containment
  if (score > 75) {
    state.containment = {
      active: true,
      transactionsHeld: state.containment.transactionsHeld + 1,
      accountsFrozen: [...new Set([...state.containment.accountsFrozen, targetAccount])],
      timestamp: Date.now(),
    }
  }

  // Financial exposure
  const totalAtRisk = state.transactionEvents
    .filter(t => {
      const r = state.riskScores.find(rs => rs.accountId === t.accountId)
      return r && r.unifiedScore > 50
    })
    .reduce((sum, t) => sum + t.amount, 0)

  state.financialExposure = {
    fundsAtRisk: totalAtRisk,
    estimatedLossPrevented: Math.round(totalAtRisk * 0.72),
    recoveryProbability: score > 75 ? 0.45 : score > 50 ? 0.68 : 0.89,
    containmentResponseTime: rand(200, 2500),
  }

  state.events = [unifiedEvent, ...state.events].slice(0, 30)

  return { ...state }
}

export function getState(): SimulationState {
  return { ...state }
}

export function updateGeminiAnalysis(analysis: GeminiAnalysis) {
  state.geminiAnalysis = analysis
}

export function updateGeminiUserExplanation(explanation: GeminiUserExplanation) {
  state.geminiUserExplanation = explanation
}

export type { GeminiAnalysis, GeminiUserExplanation } from './types'
