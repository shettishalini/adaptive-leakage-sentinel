
import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Database, Network, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen pt-24 digital-pattern-green flex flex-col justify-center overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-40" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-40" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className={`max-w-2xl ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 border border-green-100 mb-6">
              <p className="text-xs font-medium text-green-700">Adaptive Security System</p>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Adaptive Data Leakage <span className="gradient-text-green">Detection</span> System
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our AI-powered system continuously learns from new data patterns, 
              identifying emerging threats and adapting to evolving leakage patterns 
              in real-time to provide unmatched protection for your sensitive information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 h-auto rounded-md shadow-md shadow-green-200">
                Request a Demo
              </Button>
              <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50 px-8 py-6 h-auto rounded-md">
                Learn More
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-1 text-green-600">99.8%</h3>
                <p className="text-sm text-gray-500">Detection Rate</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-1 text-green-600">0.1%</h3>
                <p className="text-sm text-gray-500">False Positives</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-1 text-green-600">24/7</h3>
                <p className="text-sm text-gray-500">Monitoring</p>
              </div>
            </div>
          </div>

          <div className={`flex-1 ${isLoaded ? "animate-fade-in-delay" : "opacity-0"}`}>
            <div className="relative w-full h-full">
              <div className="glass p-6 rounded-2xl shadow-xl max-w-md mx-auto border border-green-100/20">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Security Dashboard</h3>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Protected</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/50 p-4 rounded-lg flex items-start gap-3 border border-green-50">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Anomaly Detected</h4>
                      <p className="text-xs text-gray-500">Large file transfer in HR department</p>
                    </div>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg flex items-start gap-3 border border-green-50">
                    <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Database Access</h4>
                      <p className="text-xs text-gray-500">Unusual query pattern detected</p>
                    </div>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg flex items-start gap-3 border border-green-50">
                    <Network className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Network Traffic</h4>
                      <p className="text-xs text-gray-500">New connection to unrecognized IP</p>
                    </div>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg flex items-start gap-3 border border-green-50">
                    <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Security Update</h4>
                      <p className="text-xs text-gray-500">Model has been retrained</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">Last updated: Just now</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 glass p-3 rounded-lg shadow-lg animate-flow border border-green-100/20">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs font-medium">AI Monitoring Active</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass p-3 rounded-lg shadow-lg animate-flow border border-green-100/20">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs font-medium">Adaptive Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
