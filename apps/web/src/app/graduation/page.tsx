// ABOUTME: Main graduation invitation page combining all sections
// ABOUTME: Single-page layout with hero, details, RSVP, map, FAQ, and footer

import { HeroCover } from './components/HeroCover';
import { EventDetails } from './components/EventDetails';
import { AboutGraduate } from './components/AboutGraduate';
import { MiniSchedule } from './components/MiniSchedule';
import { RSVPSection } from './components/RSVPSection';
import { LocationMap } from './components/LocationMap';
import { FAQSection } from './components/FAQSection';
import { GalleryPolaroid } from './components/GalleryPolaroid';
import { FooterRecap } from './components/FooterRecap';

export default function GraduationPage() {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-graduation-primary focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="bg-graduation-bg min-h-screen">
        <HeroCover />
        <EventDetails />
        <AboutGraduate />
        <MiniSchedule />
        <RSVPSection />
        <LocationMap />
        <FAQSection />
        <GalleryPolaroid />
        <FooterRecap />
      </main>
    </>
  );
}
