import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import AppShowcaseSection from '@/components/AppShowcaseSection';
import EmailSignupSection from '@/components/EmailSignupSection';
import Footer from '@/components/Footer';
import AIMatchingSimpleSection from '@/components/AIMatchingSimpleSection';
import MockupSection from '@/components/MockupSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionSection />
      <AIMatchingSimpleSection />
      <div className="mb-[100px] md:mb-32 mt-[300px]" />
      <AppShowcaseSection />
      <div className="mb-[100px] md:mb-32" />
      <MockupSection />
      <EmailSignupSection />
      <Footer />
    </div>
  );
};

export default Index;
