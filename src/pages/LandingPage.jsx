import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import DifferentSection from '../components/DifferentSection';
import HowItWorks from '../components/HowItWorks';
import FullRouteSection from '../components/FullRouteSection';
import PreferredLocationsSection from '../components/PreferredLocationsSection';
import RiderSection from '../components/RiderSection';
import SeekerSection from '../components/SeekerSection';
import InteractiveMatchingDemo from '../components/InteractiveMatchingDemo';
import PricingPlans from '../components/PricingPlans';
import TrustSafety from '../components/TrustSafety';
import FAQ from '../components/FAQ';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <DifferentSection />
        <HowItWorks />
        <FullRouteSection />
        <PreferredLocationsSection />
        <RiderSection />
        <SeekerSection />
        <InteractiveMatchingDemo />
        <PricingPlans />
        <TrustSafety />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
