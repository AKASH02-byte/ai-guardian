import type { DashboardData, TopRiskItem } from '../types';

export type EntityId = 'bharat-financial' | 'peak-capital' | 'indic-national' | 'zenpay';

export interface EntityProfile {
  id: EntityId;
  name: string;
  tier: string;
  dashboard: DashboardData;
}

type ThreatSeed = Omit<TopRiskItem, 'id' | 'expected_loss_inr'>;

const risk = (id: number, item: ThreatSeed): TopRiskItem => ({
  ...item,
  id,
  // Expected loss is intentionally calculated, never hand-entered: Impact × Likelihood.
  expected_loss_inr: Math.round(item.impact_inr * (item.likelihood_pct / 100))
});

const profile = (
  metrics: DashboardData['metrics'],
  threats: ThreatSeed[],
  categories: Array<[string, number]>,
  posture: number[]
): DashboardData => {
  const trendMultipliers = [0.92, 0.95, 0.91, 0.97, 0.94, 1];
  return {
    metrics,
    risk_trend: trendMultipliers.map((multiplier, index) => ({
      date: ['Aug 01', 'Aug 07', 'Aug 13', 'Aug 19', 'Aug 25', 'Today'][index],
      risk_inr: Math.round(metrics.current_cyber_risk_inr * multiplier),
      expected_loss_inr: Math.round(metrics.expected_annual_loss_inr * multiplier),
      posture_score: metrics.security_posture_score
    })),
    risk_by_category: categories.map(([category, risk_inr]) => ({
      category,
      risk_inr,
      percentage: Math.round((risk_inr / metrics.current_cyber_risk_inr) * 100)
    })),
    top_risks: threats.map((item, index) => risk(index + 1, item)),
    security_posture: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'].map((name, index) => ({
      name,
      score: posture[index],
      status: posture[index] >= 75 ? 'Mature' : posture[index] >= 60 ? 'Managed' : 'Needs improvement'
    }))
  };
};

export const entityProfiles: EntityProfile[] = [
  {
    id: 'bharat-financial',
    name: 'Bharat Financial Services Ltd.',
    tier: 'NBFC / Microfinance',
    dashboard: profile(
      { current_cyber_risk_inr: 4260000, expected_annual_loss_inr: 1840000, security_posture_score: 68, critical_risks_count: 7, security_budget_inr: 1000000 },
      [
        { risk_title: 'Ransomware on Core DB', category: 'Ransomware', asset_name: 'Core Lending Database', likelihood_pct: 32, impact_inr: 5600000, severity: 'Critical', trend: 'UP', confidence_score_pct: 94 },
        { risk_title: 'Authentication Server Hijacking', category: 'Identity', asset_name: 'IAM Authentication Server', likelihood_pct: 27, impact_inr: 3200000, severity: 'High', trend: 'UP', confidence_score_pct: 89 },
        { risk_title: 'PCI-DSS API Leak', category: 'Data Exposure', asset_name: 'Payments API Gateway', likelihood_pct: 22, impact_inr: 2700000, severity: 'High', trend: 'STABLE', confidence_score_pct: 87 }
      ],
      [['Ransomware', 1540000], ['Identity', 980000], ['Data Exposure', 790000], ['Third Party', 540000], ['Cloud', 410000]],
      [70, 66, 71, 64, 69]
    )
  },
  {
    id: 'peak-capital',
    name: 'Peak Capital Small Finance Bank',
    tier: 'Small Finance / Mid-Tier',
    dashboard: profile(
      { current_cyber_risk_inr: 18500000, expected_annual_loss_inr: 6420000, security_posture_score: 74, critical_risks_count: 4, security_budget_inr: 4500000 },
      [
        { risk_title: 'Mobile Banking API Exploitation', category: 'Application', asset_name: 'Mobile Banking API', likelihood_pct: 24, impact_inr: 12000000, severity: 'Critical', trend: 'UP', confidence_score_pct: 93 },
        { risk_title: 'Third-Party Supply Chain Breach', category: 'Third Party', asset_name: 'Loan Origination Partner', likelihood_pct: 18, impact_inr: 8400000, severity: 'High', trend: 'UP', confidence_score_pct: 88 },
        { risk_title: 'Cloud Misconfiguration', category: 'Cloud', asset_name: 'Customer Data Lake', likelihood_pct: 21, impact_inr: 5100000, severity: 'High', trend: 'STABLE', confidence_score_pct: 85 }
      ],
      [['Application', 5600000], ['Third Party', 4200000], ['Cloud', 3400000], ['Identity', 2900000], ['Fraud', 2400000]],
      [77, 73, 75, 70, 74]
    )
  },
  {
    id: 'indic-national',
    name: 'Indic National Commercial Bank',
    tier: 'Tier-1 Public / Private Bank',
    dashboard: profile(
      { current_cyber_risk_inr: 124000000, expected_annual_loss_inr: 38200000, security_posture_score: 84, critical_risks_count: 12, security_budget_inr: 25000000 },
      [
        { risk_title: 'SWIFT Financial Gateway Compromise', category: 'Payments', asset_name: 'SWIFT Financial Gateway', likelihood_pct: 14, impact_inr: 85000000, severity: 'Critical', trend: 'UP', confidence_score_pct: 96 },
        { risk_title: 'ATM Switch DDoS & Ransomware', category: 'Availability', asset_name: 'National ATM Switch', likelihood_pct: 19, impact_inr: 42000000, severity: 'Critical', trend: 'UP', confidence_score_pct: 92 },
        { risk_title: 'Zero-Day in Core Banking Software (CBS)', category: 'Application', asset_name: 'Core Banking Platform', likelihood_pct: 11, impact_inr: 60000000, severity: 'Critical', trend: 'STABLE', confidence_score_pct: 90 }
      ],
      [['Payments', 39500000], ['Application', 30200000], ['Availability', 24600000], ['Identity', 16200000], ['Third Party', 13500000]],
      [87, 85, 84, 80, 83]
    )
  },
  {
    id: 'zenpay',
    name: 'ZenPay Digital Payments & Wallet Network',
    tier: 'Fintech / Payment Aggregator',
    dashboard: profile(
      { current_cyber_risk_inr: 8500000, expected_annual_loss_inr: 3150000, security_posture_score: 61, critical_risks_count: 9, security_budget_inr: 2000000 },
      [
        { risk_title: 'Credential Stuffing & Account Takeover', category: 'Identity', asset_name: 'Wallet Authentication Platform', likelihood_pct: 41, impact_inr: 4200000, severity: 'Critical', trend: 'UP', confidence_score_pct: 95 },
        { risk_title: 'Fraudulent Payment Webhooks', category: 'Payments', asset_name: 'Merchant Webhook Service', likelihood_pct: 29, impact_inr: 3700000, severity: 'High', trend: 'UP', confidence_score_pct: 90 },
        { risk_title: 'Insider Threat / Token Leakage', category: 'Data Exposure', asset_name: 'Developer Token Vault', likelihood_pct: 16, impact_inr: 6400000, severity: 'High', trend: 'STABLE', confidence_score_pct: 84 }
      ],
      [['Identity', 2820000], ['Payments', 2010000], ['Data Exposure', 1480000], ['Cloud', 1220000], ['Application', 970000]],
      [63, 59, 66, 55, 62]
    )
  }
];

export const getEntityProfile = (id: EntityId) =>
  entityProfiles.find((entity) => entity.id === id) ?? entityProfiles[0];
