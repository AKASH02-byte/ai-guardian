import type {
  DashboardData,
  Asset,
  Vulnerability,
  Threat,
  SecurityControl,
  OptimizeResponse,
  SimulationResponse,
  Recommendation,
  ExecutiveReport
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1';

export const formatINR = (val: number): string => {
  if (val >= 10000000) { // 1 Crore = 10,000,000
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (val >= 100000) { // 1 Lakh = 100,000
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  } else {
    return `₹${val.toLocaleString('en-IN')}`;
  }
};

export const api = {
  async getDashboard(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async getAssets(): Promise<Asset[]> {
    const res = await fetch(`${API_BASE}/assets`);
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  async getVulnerabilities(filters?: { minCvss?: number; exploitable?: boolean; exposed?: boolean }): Promise<Vulnerability[]> {
    const params = new URLSearchParams();
    if (filters?.minCvss) params.append('min_cvss', filters.minCvss.toString());
    if (filters?.exploitable) params.append('exploitable_only', 'true');
    if (filters?.exposed) params.append('exposed_only', 'true');

    const res = await fetch(`${API_BASE}/vulnerabilities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch vulnerabilities');
    return res.json();
  },

  async getThreats(): Promise<Threat[]> {
    const res = await fetch(`${API_BASE}/threats`);
    if (!res.ok) throw new Error('Failed to fetch threats');
    return res.json();
  },

  async getControls(): Promise<SecurityControl[]> {
    const res = await fetch(`${API_BASE}/controls`);
    if (!res.ok) throw new Error('Failed to fetch security controls');
    return res.json();
  },

  async optimizeInvestment(budgetInr: number): Promise<OptimizeResponse> {
    const res = await fetch(`${API_BASE}/investments/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available_budget_inr: budgetInr })
    });
    if (!res.ok) throw new Error('Failed to optimize budget');
    return res.json();
  },

  async runSimulation(controlIds: string[]): Promise<SimulationResponse> {
    const res = await fetch(`${API_BASE}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_control_ids: controlIds })
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return res.json();
  },

  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getExecutiveReport(): Promise<ExecutiveReport> {
    const res = await fetch(`${API_BASE}/reports/executive`);
    if (!res.ok) throw new Error('Failed to fetch executive report');
    return res.json();
  }
};
