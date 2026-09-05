import { useState } from 'react';
import { Sidebar, type NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { AssetsPage } from './pages/AssetsPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { ThreatsPage } from './pages/ThreatsPage';
import { ControlsPage } from './pages/ControlsPage';
import { InvestmentOptimizerPage } from './pages/InvestmentOptimizerPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EntityProvider, useEntity } from './context/EntityContext';

export function App() {
  return <EntityProvider><AppShell /></EntityProvider>;
}

function AppShell() {
  const [currentTab, setCurrentTab] = useState<NavItem>('overview');
  const { activeEntityId, entity, setActiveEntityId } = useEntity();

  const pageMeta: Record<NavItem, { title: string; subtitle: string }> = {
    overview: {
      title: 'Executive Risk & Investment Dashboard',
      subtitle: 'Continuous Cyber Risk Quantification & Portfolio Capital Allocation'
    },
    'risk-intelligence': {
      title: 'Risk Intelligence & Matrix Workspace',
      subtitle: 'Likelihood x Business Impact Risk Quantification Engine'
    },
    assets: {
      title: 'Enterprise Infrastructure Asset Register',
      subtitle: 'Asset Criticality, Exposure, and Financial Valuation'
    },
    vulnerabilities: {
      title: 'AI-Prioritized Vulnerability Management',
      subtitle: 'Business-Aware Priority Scoring beyond raw CVSS'
    },
    threats: {
      title: 'Threat Intelligence & Campaign Telemetry',
      subtitle: 'Active Cyber Threat Actor Monitoring and Timeline'
    },
    controls: {
      title: 'Security Controls & Defense Mitigation',
      subtitle: 'Coverage, Effectiveness, and Financial Risk Reduction'
    },
    optimizer: {
      title: 'Cybersecurity Investment Optimizer',
      subtitle: '0-1 Knapsack Budget Optimization for Maximum Risk Mitigation'
    },
    simulator: {
      title: 'What-If Investment Simulator',
      subtitle: 'Interactive Scenario Modeling & Cumulative Risk Reduction'
    },
    recommendations: {
      title: 'Explainable AI Security Recommendations',
      subtitle: 'Transparent Rationale, Risk Factors & Confidence Ratings'
    },
    reports: {
      title: 'Executive & Board Risk Summary Report',
      subtitle: 'Printable C-Suite Presentation & Financial Risk Quantification'
    },
    settings: {
      title: 'Platform & Governance Settings',
      subtitle: 'Organization Profiles, Risk Thresholds & Telemetry Connectors'
    }
  };

  const meta = pageMeta[currentTab];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Left Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <Header
          pageTitle={meta.title}
          pageSubtitle={meta.subtitle}
          selectedEntity={activeEntityId}
          onEntityChange={setActiveEntityId}
        />

        {/* Page Container */}
        <main className="flex-1 bg-slate-50">
          {currentTab === 'overview' && (
            <OverviewPage
              onNavigateTab={setCurrentTab}
              entity={entity}
            />
          )}
          {currentTab === 'risk-intelligence' && <RiskIntelligencePage onNavigateTab={setCurrentTab} />}
          {currentTab === 'assets' && <AssetsPage />}
          {currentTab === 'vulnerabilities' && <VulnerabilitiesPage />}
          {currentTab === 'threats' && <ThreatsPage />}
          {currentTab === 'controls' && <ControlsPage />}
          {currentTab === 'optimizer' && <InvestmentOptimizerPage />}
          {currentTab === 'simulator' && <WhatIfSimulatorPage />}
          {currentTab === 'recommendations' && <RecommendationsPage onNavigateTab={setCurrentTab} />}
          {currentTab === 'reports' && <ReportsPage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
