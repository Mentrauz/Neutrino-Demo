import { useState } from 'react';
import { calculateFactors } from './utils/calculator';
import { useLocalStorage } from './hooks/useLocalStorage';
import DateInput from './components/DateInput';
import ResultsTable from './components/ResultsTable';
import Charts from './components/Charts';
import ParentIndicator from './components/ParentIndicator';
import ThemeToggle from './components/ThemeToggle';
import ExportButtons from './components/ExportButtons';
import './index.css';

function LotusLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lotus petals */}
      <path d="M20 6C20 6 15 14 15 20C15 23 17 25 20 25C23 25 25 23 25 20C25 14 20 6 20 6Z" fill="#BB854A" opacity="0.7"/>
      <path d="M10 14C10 14 12 22 16 25C18 27 20 26 20 24C20 20 10 14 10 14Z" fill="#C09660" opacity="0.5"/>
      <path d="M30 14C30 14 28 22 24 25C22 27 20 26 20 24C20 20 30 14 30 14Z" fill="#C09660" opacity="0.5"/>
      <path d="M6 20C6 20 13 23 17 24C19 25 20 24 20 22C18 18 6 20 6 20Z" fill="#D4A56A" opacity="0.35"/>
      <path d="M34 20C34 20 27 23 23 24C21 25 20 24 20 22C22 18 34 20 34 20Z" fill="#D4A56A" opacity="0.35"/>
      {/* Center dot */}
      <circle cx="20" cy="22" r="2.5" fill="#BB854A"/>
      {/* Base */}
      <path d="M14 28Q17 30 20 30Q23 30 26 28" stroke="#BB854A" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M16 30Q18 33 20 33Q22 33 24 30" stroke="#BB854A" strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  );
}

export default function App() {
  const [savedResults, setSavedResults] = useLocalStorage('plc-results', null);
  const [results, setResults] = useState(savedResults);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDateSelect = (dob) => {
    setIsAnimating(true);
    setTimeout(() => {
      const calculated = calculateFactors(dob);
      setResults(calculated);
      setSavedResults(calculated);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="app">
      {/* Subtle background decorations */}
      <div className="bg-pattern" aria-hidden="true" />
      <div className="bg-mandala" aria-hidden="true" />

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-mark">
              <LotusLogo />
            </div>
            <h1 className="logo-text">
              Parental Legacy
              <span className="logo-sub">Life Factors Calculator</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            ✦ Vedic Life Analysis
          </div>
          <h2 className="hero-title">
            Discover Your <em>Parental Legacy</em>
          </h2>
          <p className="hero-tagline">
            Explore the unique blend of maternal and paternal influence woven
            into your birth date — seven factors that shape your life path.
          </p>
          <div className="divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-dot" />
            <span className="divider-line" />
          </div>
          <DateInput onDateSelect={handleDateSelect} />
        </section>

        {/* Results Section */}
        {results && !isAnimating && (
          <section className="results-section fade-in">
            <ParentIndicator results={results} />
            <ResultsTable results={results} />
            <Charts results={results} />
            <ExportButtons results={results} />
          </section>
        )}

        {isAnimating && (
          <div className="loading-spinner">
            <div className="spinner" />
            <p>Consulting the charts...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Parental Legacy Calculator &mdash; Rooted in tradition, rendered in code</p>
      </footer>
    </div>
  );
}
