'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="bg-[#11131c] text-[#e1e1ee] font-sans selection:bg-[#0f62fe] selection:text-white mt-[-64px]">
      {/* Hero Section */}
      <section className="relative h-[870px] flex items-center justify-start overflow-hidden w-full">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Satellite Imagery" 
            className="w-full h-full object-cover opacity-70 mix-blend-lighten" 
            src="/Images/screen.png"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#11131c] via-[#11131c]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-24 md:px-48 w-full">
          <div className="max-w-2xl space-y-24">
            <h1 className="text-[56px] font-[300] leading-[1.1] tracking-[-1.4px] text-white">LankaGeo</h1>
            <p className="text-[24px] font-[300] leading-[1.4] tracking-[-1px] text-[#c3c6d8] max-w-xl">
              Precision SAR satellite monitoring for Sri Lanka&apos;s high-risk regions. 
              Real-time penetration through dense cloud cover for disaster mitigation.
            </p>
            <div className="pt-16">
              <div className="relative max-w-md group">
                <span className="absolute inset-y-0 left-16 flex items-center text-[#8c90a2] group-focus-within:text-[#0f62fe] transition-colors">
                  <span className="material-symbols-outlined">search</span>
                </span>
                <input 
                  className="w-full bg-[#262626] border-none border-b-2 border-[#424656] focus:border-[#0f62fe] focus:ring-0 text-white pl-48 py-16 rounded-none transition-all shadow-lg font-body outline-none" 
                  placeholder="Search regions or monitoring coordinates..." 
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body Section: About & Mission */}
      <section className="py-96 px-24 md:px-48 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-64 items-start">
          <div className="lg:col-span-5 space-y-32">
            <div className="inline-flex items-center px-12 py-4 bg-[#272a33] border border-[#424656] rounded-none">
              <span className="text-[11px] font-[500] leading-[14px] tracking-[0.5px] text-[#b4c5ff] uppercase">Our Mission</span>
            </div>
            <h2 className="text-[42px] font-[300] leading-[1.15] tracking-[-1px] text-white">About LankaGeo</h2>
            <div className="space-y-16 text-[#c3c6d8]">
              <p className="text-[16px] leading-[1.6]">
                Lanka Geo delivers high-precision flood analysis to support disaster response and regional safety across Sri Lanka. By transforming complex satellite telemetry into simple, data-driven reports, we empower the Disaster Management Center and local communities to act quickly and effectively during environmental crises.
              </p>
            </div>
          </div>

          {/* Feature Highlights: Bento Grid Layout */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Feature 1 */}
            <div className="p-32 bg-[#262626] border border-[#424656] hover:border-[#0f62fe]/50 transition-all group flex flex-col justify-between min-h-[256px] md:col-span-2">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1d1f28] rounded-lg border border-[#424656] text-[#b4c5ff] group-hover:bg-[#0f62fe] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">satellite_alt</span>
                </div>
              </div>
              <div className="space-y-4 pt-16">
                <h3 className="text-white font-[300] text-[18px]">Advanced SAR Monitoring</h3>
                <p className="text-[#c3c6d8] text-[14px] leading-[1.5]">Uses advanced Radar technology to see through heavy rain, clouds, and darkness, providing clear flood maps even during the worst monsoon storms.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-32 bg-[#262626] border border-[#424656] hover:border-[#0f62fe]/50 transition-all group flex flex-col justify-between min-h-[256px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1d1f28] rounded-lg border border-[#424656] text-[#b4c5ff] group-hover:bg-[#0f62fe] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
              </div>
              <div className="space-y-4 pt-16">
                <h3 className="text-white font-[300] text-[18px]">Real-time Risk Assessment</h3>
                <p className="text-[#c3c6d8] text-[14px] leading-[1.5]">Automated analysis pipelines that identify vulnerabilities and flood risks as they emerge.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-32 bg-[#262626] border border-[#424656] hover:border-[#0f62fe]/50 transition-all group flex flex-col justify-between min-h-[256px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1d1f28] rounded-lg border border-[#424656] text-[#b4c5ff] group-hover:bg-[#0f62fe] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">emergency_share</span>
                </div>
              </div>
              <div className="space-y-4 pt-16">
                <h3 className="text-white font-[300] text-[18px]">Agile Response Coordination</h3>
                <p className="text-[#c3c6d8] text-[14px] leading-[1.5]">Turning complex satellite images into clear, actionable maps and reports to help Sri Lankan emergency teams respond to floods faster.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
