'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SettingsPanel } from './settings-panel';
import { MapGrid } from './gameboy/MapGrid';
import { ErrorBoundary } from './gameboy/ErrorBoundary';
import { PokemonHeading, PokemonText } from './text';
import { Header } from './Header';

interface HomeClientProps {
  className?: string;
}

export function HomeClient({ className = '' }: HomeClientProps) {
  const [currentView, setCurrentView] = useState<'classic' | 'gameboy'>('gameboy');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle GameBoy errors
  const handleGameBoyError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('GameBoy interface error:', error, errorInfo);

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `GameBoy Error: ${error.message}`,
        fatal: false,
      });
    }
  };

  // Listen for custom events to switch views (from error boundary)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleSwitchToClassic = () => {
        setCurrentView('classic');
      };

      window.addEventListener('switchToClassicView', handleSwitchToClassic);

      return () => {
        window.removeEventListener('switchToClassicView', handleSwitchToClassic);
      };
    }
  }, []);

  return (
    <main
      className={`min-h-screen ${className}`}
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-ink)'
      }}
    >
      {/* Header Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      {/* Main Content - GameBoy or Classic View */}
      {currentView === 'gameboy' ? (
        <section className="container px-4 py-8 mx-auto">
          <ErrorBoundary onError={handleGameBoyError}>
            <MapGrid className="w-full" />
          </ErrorBoundary>
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="container px-4 py-20 mx-auto">
            <div className="max-w-4xl">
              <PokemonHeading>
                Hi, I&apos;m <span style={{ color: 'var(--color-primary)' }}>Khanh Nguyen</span>
              </PokemonHeading>
              <PokemonText className="mb-6">
                Full-stack developer specializing in modern web applications with React, Next.js,
                Vue.js, and scalable backend systems.
              </PokemonText>
              <PokemonText className="mb-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <span>📍 Ho Chi Minh City, Vietnam</span>
                  <span>📧 nguyenckhanh71@gmail.com</span>
                  <span>📱 (+84)868 750 030</span>
                </div>
              </PokemonText>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:nguyenckhanh71@gmail.com"
                  className="pokemon-button px-6 py-3 text-center"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  Get in Touch
                </a>
                <Link
                  href="/project"
                  className="pokemon-button px-6 py-3 text-center hover:scale-105 transition-transform"
                >
                  View Projects
                </Link>
                <Link
                  href="/job"
                  className="pokemon-button px-6 py-3 text-center hover:scale-105 transition-transform"
                >
                  View Experience
                </Link>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="container px-4 py-16 mx-auto">
            <PokemonHeading className="text-center mb-8">Education</PokemonHeading>
            <div className="pokemon-card p-6 max-w-4xl mx-auto">
              <div className="relative z-10">
                <h4 className="mb-2 text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  University of Science, VNUHCM (HCMUS)
                </h4>
                <PokemonText className="mb-2">Bachelor of Information Technology</PokemonText>
                <PokemonText className="mb-2">GPA: 9.17/10 • Expected 2025</PokemonText>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1 text-sm font-pixel uppercase tracking-wider border-2 rounded"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor:
                        'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    Software Architecture
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-pixel uppercase tracking-wider border-2 rounded"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor:
                        'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    Software Testing
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-pixel uppercase tracking-wider border-2 rounded"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor:
                        'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    Algorithms
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-pixel uppercase tracking-wider border-2 rounded"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor:
                        'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    Java
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-pixel uppercase tracking-wider border-2 rounded"
                    style={{
                      borderColor: 'var(--color-secondary)',
                      backgroundColor:
                        'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    IELTS 6.5
                  </span>
                </div>
                <PokemonText>HCMC, Vietnam</PokemonText>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="container px-4 py-16 mx-auto">
            <PokemonHeading className="text-center mb-8">Technical Skills</PokemonHeading>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="pokemon-card p-4 sm:p-6 hover:gba-shadow-lg transition-all duration-300">
                <h4
                  className="mb-2 text-lg sm:text-xl font-bold font-pixel uppercase"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Frontend
                </h4>
                <PokemonText>React, Next.js, Vue.js, TailwindCSS</PokemonText>
              </div>
              <div className="pokemon-card p-4 sm:p-6 hover:gba-shadow-lg transition-all duration-300">
                <h4
                  className="mb-2 text-lg sm:text-xl font-bold font-pixel uppercase"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Backend
                </h4>
                <PokemonText>NestJS, FastAPI, Golang, Python, Java</PokemonText>
              </div>
              <div className="pokemon-card p-4 sm:p-6 hover:gba-shadow-lg transition-all duration-300">
                <h4
                  className="mb-2 text-lg sm:text-xl font-bold font-pixel uppercase"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Cloud & DevOps
                </h4>
                <PokemonText>Docker, CI/CD, GitHub Actions, GitLab</PokemonText>
              </div>
              <div className="pokemon-card p-4 sm:p-6 hover:gba-shadow-lg transition-all duration-300">
                <h4
                  className="mb-2 text-lg sm:text-xl font-bold font-pixel uppercase"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Developer Tools
                </h4>
                <PokemonText>Git, GitHub, GitLab, Webpack, Postman</PokemonText>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  );
}
