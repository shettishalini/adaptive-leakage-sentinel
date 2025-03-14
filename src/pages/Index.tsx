
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/dashboard";
import DatasetUpload from "@/components/DatasetUpload";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <div id="dataset-upload">
        <DatasetUpload />
      </div>
      <div id="dashboard">
        <Dashboard />
      </div>
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
