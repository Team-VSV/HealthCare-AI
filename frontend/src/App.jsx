import React, { useState } from 'react';
import HeartDiseaseForm from './components/HeartDiseaseForm';
import PneumoniaScanner from './components/PneumoniaScanner';
import SymptomChecker from './components/SymptomChecker';
import MentalHealthAssessment from './components/MentalHealthAssessment';
import TreatmentRecommender from './components/TreatmentRecommender';
import {
  HeartPulse, Stethoscope, Search, Brain, Pill,
  LayoutDashboard, ArrowRight, Menu, X, Activity
} from 'lucide-react';

const MODULES = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    section: 'navigation',
  },
  {
    id: 'heart',
    label: 'Heart Disease',
    icon: <HeartPulse size={18} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    description: 'Predict coronary disease risk using 13 clinical factors with Random Forest ML',
    section: 'diagnostics',
  },
  {
    id: 'pneumonia',
    label: 'Pneumonia X-Ray',
    icon: <Stethoscope size={18} />,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'Upload chest X-rays for pneumonia detection using CNN deep learning',
    section: 'diagnostics',
  },
  {
    id: 'symptoms',
    label: 'Symptom Checker',
    icon: <Search size={18} />,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    description: 'Describe symptoms in natural language — AI matches against 30+ conditions',
    section: 'analysis',
  },
  {
    id: 'mental',
    label: 'Mental Health',
    icon: <Brain size={18} />,
    color: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    description: 'Validated PHQ-9 depression and GAD-7 anxiety screening instruments',
    section: 'analysis',
  },
  {
    id: 'treatment',
    label: 'Treatment Plan',
    icon: <Pill size={18} />,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    description: 'Evidence-based personalized treatment recommendations and monitoring plans',
    section: 'recommendations',
  },
];

const SECTION_LABELS = {
  navigation: null,
  diagnostics: 'Diagnostics',
  analysis: 'Analysis',
  recommendations: 'Recommendations',
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigateTo = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const activeModule = MODULES.find(m => m.id === activeTab);
  const diagnosticModules = MODULES.filter(m => m.section !== 'navigation');

  const renderContent = () => {
    switch (activeTab) {
      case 'heart': return <HeartDiseaseForm />;
      case 'pneumonia': return <PneumoniaScanner />;
      case 'symptoms': return <SymptomChecker />;
      case 'mental': return <MentalHealthAssessment />;
      case 'treatment': return <TreatmentRecommender />;
      default: return (
        <div>
          {/* Hero */}
          <div className="home-hero">
            <h2>HealthCare AI Platform</h2>
            <p>
              Multi-modal clinical intelligence dashboard powered by machine learning, 
              natural language processing, and evidence-based medicine.
            </p>
          </div>

          {/* Module Grid */}
          <div className="module-grid">
            {diagnosticModules.map(mod => (
              <div
                key={mod.id}
                className="module-card"
                onClick={() => navigateTo(mod.id)}
                style={{ '--card-accent': mod.color }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="module-card-icon"
                    style={{ background: mod.bg, color: mod.color }}
                  >
                    {React.cloneElement(mod.icon, { size: 24 })}
                  </div>
                  <h3>{mod.label}</h3>
                  <p>{mod.description}</p>
                </div>
                <div className="module-card-arrow">
                  <ArrowRight size={18} />
                </div>
                <style>{`
                  .module-card:hover::before {
                    background: ${mod.gradient} !important;
                  }
                `}</style>
              </div>
            ))}
          </div>

          {/* Platform Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '40px',
          }}>
            {[
              { label: 'AI Modules', value: '5', sub: 'Active' },
              { label: 'Conditions', value: '30+', sub: 'Supported' },
              { label: 'Models', value: '2', sub: 'ML Models' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Group sidebar items by section
  let lastSection = null;

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>HealthCare AI</span>
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Activity size={22} />
          </div>
          <div>
            <h1>HealthCare AI</h1>
            <span>Clinical Dashboard</span>
          </div>
          {/* Mobile close */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', display: sidebarOpen ? 'block' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {MODULES.map(mod => {
            const showSection = mod.section !== lastSection && SECTION_LABELS[mod.section];
            lastSection = mod.section;

            return (
              <React.Fragment key={mod.id}>
                {showSection && (
                  <div className="sidebar-section-label">{SECTION_LABELS[mod.section]}</div>
                )}
                <button
                  className={`sidebar-item ${activeTab === mod.id ? 'active' : ''}`}
                  onClick={() => navigateTo(mod.id)}
                  style={{
                    '--item-color': mod.color || 'var(--accent-primary)',
                  }}
                >
                  <div
                    className="nav-icon"
                    style={{
                      background: activeTab === mod.id ? (mod.bg || 'rgba(99, 102, 241, 0.1)') : 'transparent',
                      color: activeTab === mod.id ? (mod.color || 'var(--accent-primary)') : 'inherit',
                    }}
                  >
                    {mod.icon}
                  </div>
                  {mod.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          AI-powered clinical support tool<br />
          <span style={{ opacity: 0.6 }}>For educational purposes only</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <div className="main-header-title">
              {activeModule?.label || 'Dashboard'}
            </div>
            <div className="main-header-subtitle">
              {activeTab === 'home' 
                ? 'Overview of all AI modules' 
                : activeModule?.description || ''}
            </div>
          </div>
          {activeTab !== 'home' && (
            <button
              className="btn-outline"
              onClick={() => setActiveTab('home')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <LayoutDashboard size={14} /> All Modules
            </button>
          )}
        </header>

        <div className="main-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
