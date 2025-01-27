import { useRef } from "react";
import CallForActionSection from "../components/Home/CallForActionSection";
import CommunityNumbersSection from "../components/Home/CommunityNumbersSection";
import FaqsSection from "../components/Home/FaqsSection";
import FeatureSection from "../components/Home/FeatureSection";
import FeedPreviewSection from "../components/Home/FeedPreviewSection";
import HeroSection from "../components/Home/HeroSection";
import WorkStepsSection from "../components/Home/WorkStepsSection";

const Home = () => {
  // Define refs for sections
  const sectionRef = useRef(null);

  return (
    <div className="!mx-0 !w-full overflow-x-hidden bg-bg text-text">
      <HeroSection />
      <FeatureSection />
      <FeedPreviewSection />
      <WorkStepsSection />
      <CommunityNumbersSection sectionRef={sectionRef} />
      <FaqsSection />
      <CallForActionSection />
    </div>
  );
};

export default Home;
