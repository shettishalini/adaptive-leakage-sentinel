
import { useState, useEffect } from "react";
import {
  Shield,
  Database,
  Network,
  Search,
  AlertTriangle,
  Lock,
  User,
  Check,
} from "lucide-react";

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("features");
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

  const features = [
    {
      icon: Shield,
      title: "Real-time Protection",
      description:
        "Continuous monitoring and protection of your sensitive data across all channels and endpoints.",
      delay: 0,
    },
    {
      icon: Database,
      title: "Adaptive Models",
      description:
        "Machine learning algorithms that evolve and improve based on new data patterns and threats.",
      delay: 100,
    },
    {
      icon: Network,
      title: "Network Analysis",
      description:
        "Deep inspection of network traffic to identify suspicious data transfers and connections.",
      delay: 200,
    },
    {
      icon: User,
      title: "Behavior Analysis",
      description:
        "Monitor user actions to detect abnormal behavior patterns that may indicate data theft.",
      delay: 300,
    },
    {
      icon: Search,
      title: "Content Inspection",
      description:
        "Intelligent scanning of file contents to prevent sensitive information from being leaked.",
      delay: 400,
    },
    {
      icon: AlertTriangle,
      title: "Alerts & Reporting",
      description:
        "Instant notifications and comprehensive reporting on potential security incidents.",
      delay: 500,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full digital-pattern opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <p className="text-xs font-medium text-blue-700">Advanced Capabilities</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprehensive Data Leakage Protection
          </h2>
          <p className="text-gray-600">
            Our system employs multiple layers of intelligent detection to provide
            the most effective protection against all forms of data leakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: `${feature.delay}ms`,
                transitionDuration: "700ms",
              }}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold mb-4">Why Our Solution Stands Out</h3>
            <p className="text-gray-600">
              Unlike traditional systems, our approach provides significant advantages through adaptive learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Traditional Systems</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <span className="text-xs text-gray-500">✓</span>
                  </div>
                  <p className="text-gray-600">Static rule-based detection</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <span className="text-xs text-gray-500">✓</span>
                  </div>
                  <p className="text-gray-600">Manual updates required</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <span className="text-xs text-gray-500">✓</span>
                  </div>
                  <p className="text-gray-600">High false positive rates</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <span className="text-xs text-gray-500">✓</span>
                  </div>
                  <p className="text-gray-600">Limited pattern recognition</p>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold mb-4 text-primary">Our Adaptive System</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-gray-700">Self-learning algorithms</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-gray-700">Automatic model updates</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-gray-700">Reduced false positives over time</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="min-w-5 min-h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-gray-700">Advanced anomaly detection</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
