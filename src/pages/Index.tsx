
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import DatasetUpload from "@/components/DatasetUpload";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <div id="dataset-upload">
        <DatasetUpload />
      </div>
      <Dashboard />
      <HowItWorks />
      <CallToAction />
    </div>
  );
};

export default Index;
