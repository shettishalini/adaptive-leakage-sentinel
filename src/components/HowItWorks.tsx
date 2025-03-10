
import { useState, useEffect } from "react";
import { Shield, Database, Network, Search, AlertTriangle, Lock } from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("how-it-works");
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < 5 ? prev + 1 : 0));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const steps = [
    {
      icon: Network,
      title: "Data Monitoring",
      description:
        "Our system continuously monitors all data sources, including network traffic, user behavior, and file access patterns.",
    },
    {
      icon: Search,
      title: "Pattern Analysis",
      description:
        "Advanced algorithms analyze the collected data to identify patterns and anomalies that may indicate potential data leakage.",
    },
    {
      icon: Database,
      title: "Machine Learning",
      description:
        "The system employs machine learning models that continuously improve their detection capabilities based on new data.",
    },
    {
      icon: AlertTriangle,
      title: "Threat Detection",
      description:
        "When suspicious activity is detected, the system generates alerts and takes predetermined actions to mitigate risks.",
    },
    {
      icon: Lock,
      title: "Adaptive Response",
      description:
        "Based on the severity and context of the threat, the system implements appropriate response measures to prevent data leakage.",
    },
    {
      icon: Shield,
      title: "Continuous Improvement",
      description:
        "The system uses feedback from each incident to enhance its detection models, becoming more effective over time.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full digital-pattern opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <p className="text-xs font-medium text-blue-700">Adaptive Technology</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Our System Works
          </h2>
          <p className="text-gray-600">
            Our adaptive data leakage detection system uses a multi-layered approach
            with continuous learning to provide unmatched protection for your organization.
          </p>
        </div>

        <div className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 order-2 lg:order-1">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 p-6 rounded-xl transition-all duration-500 ${
                      activeStep === index
                        ? "bg-blue-50 border border-blue-100 shadow-sm transform scale-[1.02]"
                        : "bg-white"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        activeStep === index ? "bg-primary" : "bg-gray-100"
                      }`}
                    >
                      <step.icon
                        className={`h-6 w-6 ${
                          activeStep === index ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          activeStep === index ? "text-primary" : "text-gray-900"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`${
                          activeStep === index ? "text-gray-700" : "text-gray-600"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <div className="glass p-8 rounded-2xl shadow-xl max-w-md mx-auto relative">
                <h3 className="text-xl font-bold mb-6 text-center">Adaptive Intelligence in Action</h3>

                <div className="space-y-6 relative">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-white z-10"></div>
                    <div className="h-[400px] overflow-hidden">
                      {/* Data Flow Visualization */}
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 15 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm animate-flow"
                            style={{
                              animationDelay: `${index * 0.2}s`,
                              animationDuration: "3s",
                            }}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                index % 5 === 0
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  index % 5 === 0 ? "bg-red-200" : "bg-green-200"
                                }`}
                                style={{ width: `${Math.random() * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {index % 5 === 0 ? "Anomaly" : "Normal"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="bg-primary text-white p-4 rounded-lg text-center">
                      <p className="text-sm font-medium">
                        {activeStep === 0 && "Monitoring 148 data sources..."}
                        {activeStep === 1 && "Analyzing data patterns..."}
                        {activeStep === 2 && "Learning from new patterns..."}
                        {activeStep === 3 && "Potential threat identified..."}
                        {activeStep === 4 && "Implementing security measures..."}
                        {activeStep === 5 && "Updating detection models..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 glass p-3 rounded-lg shadow-lg animate-flow">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs font-medium">System Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
